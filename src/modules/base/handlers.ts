import BaseAudioHandler from '../handlers/base-audio-handler';
import BaseLightsHandler from '../handlers/base-lights-handler';
import BaseScreenHandler from '../handlers/base-screen-handler';
import SubscribeEntity from './entities/subscribe-entity';
import BaseHandler from '../handlers/base-handler';

export default class Handlers {
  private static instance: Handlers;

  private initialized: boolean = false;

  private audioHandlers: BaseAudioHandler[];

  private lightsHandlers: BaseLightsHandler[];

  private screenHandlers: BaseScreenHandler[];

  protected restoreHandlers<
    T extends SubscribeEntity,
    U extends BaseHandler<T>,
  >(entity: T, handlers: U[]) {
    handlers.forEach((handler) => {
      if (handler.constructor.name === entity.currentHandler) {
        handler.registerLightsController(entity);
      }
    });
  }

  private async init() {
    if (this.initialized) throw new Error('Handlers already initialized.');
    await Promise.all(Array.from(SubscribeEntity.entities.values()).map(async (entity) => {
      const entities = await entity.find();
      entities.forEach((instance) => {
        switch (instance.constructor.name) {
          case 'Audio': this.restoreHandlers(instance, this.audioHandlers); break;
          case 'LightsGroup': this.restoreHandlers(instance, this.lightsHandlers); break;
          case 'Screen': this.restoreHandlers(instance, this.screenHandlers); break;
          default: throw new Error(`Unknown entity: ${instance.constructor.name}`);
        }
      });
    }));
  }

  /**
   * Register all possible handlers in this function
   */
  private constructor() {
    this.screenHandlers = [];
    this.lightsHandlers = [];
    this.audioHandlers = [];
  }

  public static async getInstance() {
    if (this.instance == null) {
      this.instance = new Handlers();
      await this.instance.init();
    }
    return this.instance;
  }
}
