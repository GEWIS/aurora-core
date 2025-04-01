import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import AsyncLock from 'async-lock';
import HandlerManager from './handler-manager';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util';
import { LightsController } from './entities';
import { ScreenEntity as Screen } from '@gewis/aurora-core-screen';
import { Audio } from '@gewis/aurora-core-audio-handler';
import BaseLightsHandler from '../handlers/base-lights-handler';
import { LightsGroup } from '../lights/entities';
import { SECURE_NAMESPACES, SocketioNamespaces } from '@gewis/aurora-core-util';
import { SubscribeEntity } from '@gewis/aurora-core-util';
import { BaseHandler } from '@gewis/aurora-core-util';
import logger from '@gewis/aurora-core-logger';
import { BackofficeSyncEmitter } from '../events/backoffice-sync-emitter';
import LightsSwitchManager from './lights-switch-manager';
import { AuthUser } from '@gewis/aurora-core-util';

export default class SocketConnectionManager {
  /**
   * Semaphore required to process socket connections one at a time.
   * A subscriber may connect to two sockets at once, meaning that both
   * socketIds will be stored at the same time, resulting in only one
   * being saved. This semaphore makes sure that database transactions
   * are finished before reading the entity again.
   * @private
   */
  private lock: AsyncLock;

  constructor(
    private handlerManager: HandlerManager,
    private lightsSwitchManager: LightsSwitchManager,
    private ioServer: Server,
    private backofficeEmitter: BackofficeSyncEmitter,
  ) {
    this.lock = new AsyncLock();

    Object.values(SocketioNamespaces).forEach((namespace) => {
      ioServer.of(namespace).on('connect', (socket) => {
        this.updateSocketId((socket.request as any).user, namespace, socket.id).catch((e) => logger.error(e));
        socket.on('disconnect', () => {
          this.updateSocketId((socket.request as any).user, namespace).catch((e) => logger.error(e));
        });
      });
    });
  }

  /**
   * Socket IDs might still exist in the database on startup, for example if the application has
   * crashed and is now restarted.
   */
  public async clearSavedSocketIds() {
    await DataSourceSingleton.getInstance().get().getRepository(Audio).update({}, { socketIds: null });
    await DataSourceSingleton.getInstance().get().getRepository(Screen).update({}, { socketIds: null });
    await DataSourceSingleton.getInstance().get().getRepository(LightsController).update({}, { socketIds: null });
  }

  private async updateSocketIdForEntity<T extends SubscribeEntity>(
    repo: Repository<T>,
    id: number,
    handlers: BaseHandler<T>[],
    namespace: SocketioNamespaces,
    socketId?: string,
  ) {
    // @ts-ignore
    const entity = await repo.findOne({ where: { id } });
    if (!entity) return null;

    if (socketId && entity.socketIds) {
      entity.socketIds[namespace] = socketId;
    } else if (socketId) {
      entity.socketIds = { [namespace as SocketioNamespaces]: socketId };
    } else if (!socketId && entity.socketIds) {
      delete entity.socketIds[namespace];
    }

    await entity.save();

    handlers.forEach((h) => {
      h.entities.forEach((e) => {
        if (e.id === id) {
          e.socketIds = entity.socketIds;
          if (socketId !== undefined) {
            this.ioServer.of(namespace).sockets.get(socketId)?.emit('handler_set', h.constructor.name);
          }
        }
      });
    });

    return entity;
  }

  /**
   * Bind the socket ID in the given namespace to the given user. If no SocketID is
   * provided, the existing connection will be removed.
   * @param user
   * @param namespace
   * @param socketId
   * @private
   */
  private async updateSocketId(user: AuthUser, namespace: SocketioNamespaces, socketId?: string) {
    if (!SECURE_NAMESPACES.includes(namespace)) {
      // Public, unauthenticated namespace, so we do not have to do anything.
      if (socketId !== undefined) {
        logger.info(`Connect (${namespace}) with Socket ID ${socketId}`);
      } else {
        logger.info(`Disconnect (${namespace})`);
      }
      return;
    }

    if (user == null) {
      logger.error('Unknown user tried to connect to socket. Abort.');
      return;
    }

    await this.lock.acquire('socket_connect', async (done) => {
      if (socketId !== undefined) {
        logger.info(`Connect (${namespace}) by ${JSON.stringify(user)} with Socket ID ${socketId}`);
      } else {
        logger.info(`Disconnect (${namespace}) by ${JSON.stringify(user)}`);
      }
      if (user.audioId) {
        await this.updateSocketIdForEntity(
          DataSourceSingleton.getInstance().get().getRepository(Audio),
          user.audioId,
          this.handlerManager.getHandlers(Audio),
          namespace,
          socketId,
        );
        this.backofficeEmitter.emit('connect_audio');
      }
      if (user.screenId) {
        await this.updateSocketIdForEntity(
          DataSourceSingleton.getInstance().get().getRepository(Screen),
          user.screenId,
          this.handlerManager.getHandlers(Screen),
          namespace,
          socketId,
        );
        this.backofficeEmitter.emit('connect_screen');
      }
      if (user.lightsControllerId) {
        const controller = await this.updateSocketIdForEntity(
          DataSourceSingleton.getInstance().get().getRepository(LightsController),
          user.lightsControllerId,
          [],
          namespace,
          socketId,
        );
        if (controller) {
          const lightsHandlers: BaseLightsHandler[] = this.handlerManager.getHandlers(
            LightsGroup,
          ) as BaseLightsHandler[];
          const lightGroups = lightsHandlers.map((h) => h.entities).flat();
          lightGroups.forEach((g) => {
            if (g.controller.id !== user.lightsControllerId) return;
            // eslint-disable-next-line no-param-reassign
            g.controller.socketIds = controller.socketIds;
          });
          this.lightsSwitchManager.getEnabledSwitches().forEach((s) => {
            if (s.controller.id !== user.lightsControllerId) return;
            // eslint-disable-next-line no-param-reassign
            s.controller.socketIds = controller.socketIds;
          });
        }
        this.backofficeEmitter.emit('connect_lightsgroup');
      }
      done();
    });
  }
}
