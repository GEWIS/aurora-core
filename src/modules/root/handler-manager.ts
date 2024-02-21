import { Server } from 'socket.io';
import BaseAudioHandler from '../handlers/base-audio-handler';
import BaseLightsHandler from '../handlers/base-lights-handler';
import BaseScreenHandler from '../handlers/base-screen-handler';
import SubscribeEntity from './entities/subscribe-entity';
import BaseHandler from '../handlers/base-handler';
import SimpleAudioHandler from '../handlers/audio/simple-audio-handler';
import dataSource from '../../database';
import { Audio, Screen } from './entities';
import { LightsGroup } from '../lights/entities';
import { RandomEffectsHandler } from '../handlers/lights';
import SetEffectsHandler from '../handlers/lights/set-effects-handler';
import DevelopEffectsHandler from '../handlers/lights/develop-effects-handler';
import { BeatEvent, TrackChangeEvent } from '../events/music-emitter-events';
import { CurrentlyPlayingTrackHandler, CenturionScreenHandler } from '../handlers/screen';
import { PosterScreenHandler } from '../handlers/screen/poster';
import { ScenesHandler } from '../handlers/lights/scenes-handler';
import EffectSequenceHandler from '../handlers/lights/effect-sequence-handler';
import { MusicEmitter } from '../events';
import StageEffectsHandler from '../handlers/screen/stage-effects-handler';
import { SocketioNamespaces } from '../../socketio-namespaces';

/**
 * Main broker for managing handlers. This object registers entities to their
 * corresponding handlers and transmits events towards all known handlers.
 * Primarily used by HTTP controllers to attach entities to handlers.
 * Therefore, required to be a singleton class, because TSOA controllers are
 * otherwise unable to get an instance of this object.
 */
export default class HandlerManager {
  private static instance: HandlerManager;

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

  /**
   * Initialize the HandlerManager object if it is not already initialized.
   * It fetches all relevant entities (audios, lightGroups, screens) from the database
   * and registers them to their handlers
   * @private
   */
  public async init() {
    if (this.initialized) throw new Error('HandlerManager already initialized.');
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
  private constructor(
    private io: Server,
    private musicEmitter: MusicEmitter,
  ) {
    this.musicEmitter.on('beat', this.beat.bind(this));
    this.musicEmitter.on('change_track', this.changeTrack.bind(this));

    // Create all light handlers
    const lightsHandlers: BaseLightsHandler[] = [
      new RandomEffectsHandler(),
      new SetEffectsHandler(),
      new DevelopEffectsHandler(),
      new ScenesHandler(),
      new EffectSequenceHandler(musicEmitter),
    ];

    // Register all handlers
    this._handlers.set(Audio, [
      new SimpleAudioHandler(io.of(SocketioNamespaces.AUDIO), this.musicEmitter),
    ] as BaseAudioHandler[]);
    this._handlers.set(LightsGroup, lightsHandlers);
    this._handlers.set(Screen, [
      new CurrentlyPlayingTrackHandler(io.of(SocketioNamespaces.SCREEN)),
      new CenturionScreenHandler(io.of(SocketioNamespaces.SCREEN)),
      new PosterScreenHandler(io.of(SocketioNamespaces.SCREEN)),
      new StageEffectsHandler(io.of(SocketioNamespaces.SCREEN)),
    ] as BaseScreenHandler[]);
  }

  /**
   * Get the current instance. Parameters are only necessary if it is
   * the first time an instance is requested and a new object should be created
   * @param io
   * @param musicEmitter
   */
  public static getInstance(
    io?: Server,
    musicEmitter?: MusicEmitter,
  ) {
    if (this.instance == null && (io === undefined || musicEmitter === undefined)) {
      throw new Error('Not all parameters provided to initialize');
    } else if (this.instance == null) {
      this.instance = new HandlerManager(io!, musicEmitter!);
    }
    return this.instance;
  }

  /**
   * Get all handlers that belong to the given entity type (audio, lightsGroup, screen)
   * @param entity
   */
  public getHandlers(entity?: typeof SubscribeEntity): BaseHandler<SubscribeEntity>[] {
    if (!entity) return Array.from(this._handlers.values()).flat();
    return this._handlers.get(entity) || [];
  }

  /**
   * Register the given entity with a new handler. Before doing so, deregister with the old handler
   * If newHandler equals '' (empty string), do not register with any handler.
   * @param entity
   * @param newHandler
   */
  public registerHandler<T extends SubscribeEntity>(entity: T, newHandler: string | ''): boolean {
    const handlers = this.getHandlers(entity.constructor as typeof SubscribeEntity);
    handlers.forEach((handler) => {
      handler.removeEntity(entity);
    });

    const socketId = entity.socketIds ? (entity.socketIds[SocketioNamespaces.BASE] ?? '') : '';
    const socket = this.io.sockets.sockets.get(socketId);

    if (newHandler !== '') {
      const newHandlerObj = handlers.find((h) => h.constructor.name === newHandler);
      if (newHandlerObj === undefined) return false;
      newHandlerObj.registerEntity(entity);
      socket?.emit('handler_set', newHandlerObj.constructor.name);
    } else {
      socket?.emit('handler_remove');
      // eslint-disable-next-line no-param-reassign
      entity.currentHandler = '';
      entity.save().catch((e) => console.error(e));
    }

    return true;
  }

  /**
   * Transmit a beat to all handlers. They can decide what to do with it
   * @param event
   */
  public beat(event: BeatEvent) {
    this.getHandlers().forEach((h) => {
      if (h.beat) h.beat(event);
    });
  }

  /**
   * Transmit a track change to all screen handlers,
   * as are the only ones who can do something with it
   * @param event
   */
  public changeTrack(event: TrackChangeEvent[]) {
    const handlers = this.getHandlers();
    handlers.forEach((h) => {
      // @ts-ignore
      if (h.changeTrack) h.changeTrack(event);
    });
  }
}
