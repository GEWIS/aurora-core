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
import { MusicEmitter } from '../events';
import LightsControllerManager from './lights-controller-manager';
import { BeatEvent } from '../events/MusicEmitter';
import SetEffectsHandler from '../handlers/lights/set-effects-handler';

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
    io: Server,
    musicEmitter: MusicEmitter,
    lightsControllerHandler: LightsControllerManager,
  ) {
    // Create all light handlers
    const lightsHandlers: BaseLightsHandler[] = [
      new RandomEffectsHandler(),
      new SetEffectsHandler(),
    ];

    // Register all handlers
    this._handlers.set(Audio, [
      new SimpleAudioHandler(io.of('/audio')),
    ] as BaseAudioHandler[]);
    this._handlers.set(LightsGroup, lightsHandlers);
    this._handlers.set(Screen, [] as BaseScreenHandler[]);

    // Subscribe all lights handlers to the broker that handlers beats and ticks
    lightsControllerHandler.registerLightsHandlers(lightsHandlers);

    musicEmitter.on('beat', this.handleBeat.bind(this));
  }

  /**
   * Get the current instance. Parameters are only necessary if it is
   * the first time an instance is requested and a new object should be created
   * @param io
   * @param musicEmitter
   * @param lightsControllerHandler
   */
  public static getInstance(
    io?: Server,
    musicEmitter?: MusicEmitter,
    lightsControllerHandler?: LightsControllerManager,
  ) {
    if (this.instance == null && (io === undefined || musicEmitter === undefined)) {
      throw new Error('Not all parameters provided to initialize');
    } else if (this.instance == null) {
      this.instance = new HandlerManager(io!, musicEmitter!, lightsControllerHandler!);
    }
    return this.instance;
  }

  /**
   * Get all handlers that belong to the given entity type (audio, lightsGroup, screen)
   * @param entity
   */
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

  public handleBeat(event: BeatEvent) {
    this._handlers.forEach((handlers) => {
      handlers.forEach((h) => h.beat(event));
    });
  }
}
