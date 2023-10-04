import BaseAudioHandler from "../handlers/base-audio-handler";
import BaseLightsHandler from "../handlers/base-lights-handler";
import BaseScreenHandler from "../handlers/base-screen-handler";

export default class Handlers {
  private audioHandlers: BaseAudioHandler[];

  private lightsHandlers: BaseLightsHandler[];

  private screenHandlers: BaseScreenHandler[];

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
