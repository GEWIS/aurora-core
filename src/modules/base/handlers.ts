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

  private _audioHandlers: BaseAudioHandler[];

  private _lightsHandlers: BaseLightsHandler[];

  private _screenHandlers: BaseScreenHandler[];

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
    await Promise.all(Array.from(SubscribeEntity.entities.values()).map(async (entity) => {
      const entities = await dataSource.manager.find(entity);
      entities.forEach((instance) => {
        switch (instance.constructor) {
          case Audio: this.restoreHandlers(instance, this._audioHandlers); break;
          case LightsGroup: this.restoreHandlers(instance, this._lightsHandlers); break;
          case Screen: this.restoreHandlers(instance, this._screenHandlers); break;
          default: throw new Error(`Unknown entity: ${instance.constructor.name}`);
        }
      });
    }));

    console.log(this._audioHandlers[0]);
  }

  /**
   * Register all possible handlers in this function
   */
  public constructor() {
    this._screenHandlers = [];
    this._lightsHandlers = [];
    this._audioHandlers = [
      new SimpleAudioHandler(),
    ];
  }

  public static async getInstance() {
    if (this.instance == null) {
      this.instance = new Handlers();
      await this.instance.init();
    }
    return this.instance;
  }

  public get audioHandlers() {
    return this._audioHandlers;
  }
}
