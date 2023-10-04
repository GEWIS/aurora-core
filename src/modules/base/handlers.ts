import BaseAudioHandler from "../handlers/base-audio-handler";
import BaseLightsHandler from "../handlers/base-lights-handler";
import BaseScreenHandler from "../handlers/base-screen-handler";
import SubscribeEntity from "./entities/subscribe-entity";
import BaseHandler from "../handlers/base-handler";

export default class Handlers {
  private static instance: Handlers;

  private initialized: boolean = false;

  private audioHandlers: BaseAudioHandler[];

  private lightsHandlers: BaseLightsHandler[];

  private screenHandlers: BaseScreenHandler[];

  protected restoreHandlers<T extends SubscribeEntity, U extends BaseHandler<T>>(entity: T, handlers: U[]) {
    handlers.forEach((handler) => {
      if (handler.constructor.name === entity.currentHandler) {
        handler.registerLightsController(entity);
      }
    })
  }

  private async init() {
    if (this.initialized) throw new Error('Handlers already initialized.');
    await Promise.all(Array.from(SubscribeEntity.entities.values()).map(async (e) => {
      const entities = await e.find();
      entities.forEach((e) => {
        switch (e.constructor.name) {
          case "Audio": this.restoreHandlers(e, this.audioHandlers); break;
          case "LightsGroup": this.restoreHandlers(e, this.lightsHandlers); break;
          case "Screen": this.restoreHandlers(e, this.screenHandlers); break;
          default: throw new Error(`Unknown entity: ${e.constructor.name}`);
        }
      })
    }))
  }

  private constructor() {}

  public static async getInstance() {
    if (this.instance == null) {
      this.instance = new Handlers();
      await this.instance.init();
    }
    return this.instance;
  }

  /**
   * Register a new audio handler
   * @param handler
   */
  public addAudioHandler(handler: BaseAudioHandler) {
    this.audioHandlers.push(handler);
  }

  /**
   * Remove an existing audio handler
   * @param handler
   */
  public removeAudioHandler(handler: BaseAudioHandler) {
    const index = this.audioHandlers.findIndex((h) => h.identifier === handler.identifier);
    if (index < 0) return;
    this.audioHandlers.splice(index, 1);
  }

  /**
   * Register a new lights handler
   * @param handler
   */
  public addLightsHandler(handler: BaseLightsHandler) {
    this.lightsHandlers.push(handler);
  }

  /**
   * Remove an existing lights handler
   * @param handler
   */
  public removeLightsHandler(handler: BaseLightsHandler) {
    const index = this.lightsHandlers.findIndex((h) => h.identifier === handler.identifier);
    if (index < 0) return;
    this.lightsHandlers.splice(index, 1);
  }

  /**
   * Register a new screen handler
   * @param handler
   */
  public addScreenHandler(handler: BaseScreenHandler) {
    this.screenHandlers.push(handler);
  }

  /**
   * Remove an existing screen handler
   * @param handler
   */
  public removeScreenHandler(handler: BaseScreenHandler) {
    const index = this.screenHandlers.findIndex((h) => h.identifier === handler.identifier);
    if (index < 0) return;
    this.screenHandlers.splice(index, 1);
  }
}
