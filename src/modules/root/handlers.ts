import { singleton } from 'tsyringe';
import BaseAudioHandler from '../handlers/base-audio-handler';
import BaseLightsHandler from '../handlers/base-lights-handler';
import BaseScreenHandler from '../handlers/base-screen-handler';
import SubscribeEntity from './entities/subscribe-entity';
import BaseHandler from '../handlers/base-handler';
import SimpleAudioHandler from '../modes/audio/SimpleAudioHandler';
import dataSource from '../../database';
import { Audio, Screen } from './entities';
import { LightsGroup } from './entities/lights';

@singleton()
export default class Handlers {
  private static instance: Handlers;

  private initialized: boolean = false;

  private _handlers: Map<typeof SubscribeEntity, BaseHandler<SubscribeEntity>[]> = new Map();

  protected restoreHandlers<
    T extends SubscribeEntity,
    U extends BaseHandler<T>,
  >(entity: T, handlers: U[]) {
    handlers.forEach((handler) => {
      if (handler.constructor.name === entity.currentHandler) {
        handler.registerEntity(entity);
      }
    });
  }

  private async init() {
    if (this.initialized) throw new Error('Handlers already initialized.');
    await Promise.all(Array.from(this._handlers.keys()).map(async (entity) => {
      const entities = await dataSource.manager.find(entity);
      entities.forEach((instance) => {
        const handlers = this._handlers.get(instance.constructor as typeof SubscribeEntity);
        if (handlers === undefined) throw new Error(`Unknown entity: ${instance.constructor.name}`);
        this.restoreHandlers(instance, handlers);
      });
    }));
  }

  /**
   * Register all possible handlers in this function
   */
  public constructor() {
    this._handlers.set(Audio, [
      new SimpleAudioHandler(),
    ] as BaseAudioHandler[]);
    this._handlers.set(LightsGroup, [] as BaseLightsHandler[]);
    this._handlers.set(Screen, [] as BaseScreenHandler[]);
  }

  public static async getInstance() {
    if (this.instance == null) {
      this.instance = new Handlers();
      await this.instance.init();
    }
    return this.instance;
  }

  public getHandlers(entity: typeof SubscribeEntity) {
    return this._handlers.get(entity) || [];
  }

  /**
   * Register the given entity with a new handler. Before doing so, deregister with the old handler
   * If newHandler equals '' (empty string), do not register with any handler.
   * @param entity
   * @param newHandler
   */
  public registerHandler<T extends SubscribeEntity>(entity: T, newHandler: string | '') {
    const handlers = this.getHandlers(entity.constructor as typeof SubscribeEntity);
    handlers.forEach((handler) => {
      handler.removeEntity(entity);
    });

    if (newHandler !== '') {
      handlers.forEach((handler) => {
        if (handler.constructor.name === newHandler) {
          handler.registerEntity(entity);
        }
      });
    }
  }
}
