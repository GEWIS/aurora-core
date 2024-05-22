import { LightsGroup } from '../lights/entities';
import { Audio, Screen } from '../root/entities';
import HandlerManager from '../root/handler-manager';
import BaseLightsHandler from '../handlers/base-lights-handler';
import BaseAudioHandler from '../handlers/base-audio-handler';
import BaseScreenHandler from '../handlers/base-screen-handler';

export default abstract class BaseMode<
  T extends BaseLightsHandler,
  U extends BaseScreenHandler,
  V extends BaseAudioHandler,
> {
  protected handlerManager = HandlerManager.getInstance();

  protected lightsHandler: T;

  protected screenHandler: U;

  protected audioHandler: V;

  /**
   * Assign the given entities to the given handlers
   */
  protected constructor(
    protected lights: LightsGroup[],
    protected screens: Screen[],
    protected audios: Audio[],
    protected readonly lightsHandlerName: string,
    protected readonly screenHandlerName: string,
    protected readonly audioHandlerName: string,
  ) {
    lights.forEach((lightsGroup) => {
      this.handlerManager.registerHandler(lightsGroup, lightsHandlerName);
    });
    screens.forEach((screen) => {
      this.handlerManager.registerHandler(screen, screenHandlerName);
    });
    audios.forEach((audio) => {
      this.handlerManager.registerHandler(audio, audioHandlerName);
    });

    this.lightsHandler = this.handlerManager
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === lightsHandlerName) as T;
    if (!this.lightsHandler)
      throw new Error(`LightsHandler with name "${lightsHandlerName}" not found.`);

    this.screenHandler = this.handlerManager
      .getHandlers(Screen)
      .find((h) => h.constructor.name === screenHandlerName) as U;
    if (!this.lightsHandler)
      throw new Error(`ScreenHandler with name "${screenHandlerName}" not found.`);

    this.audioHandler = this.handlerManager
      .getHandlers(Audio)
      .find((h) => h.constructor.name === audioHandlerName) as V;
    if (!this.lightsHandler)
      throw new Error(`AudioHandler with name "${audioHandlerName}" not found.`);
  }

  /**
   * Unregister all listeners from the handler corresponding to this mode.
   */
  destroy(): void {
    this.lights.forEach((lightsGroup) => {
      if (this.handlerManager.getHandler(lightsGroup) !== this.lightsHandlerName) return;
      this.handlerManager.registerHandler(lightsGroup, '');
    });
    this.screens.forEach((screen) => {
      if (this.handlerManager.getHandler(screen) !== this.screenHandlerName) return;
      this.handlerManager.registerHandler(screen, '');
    });
    this.audios.forEach((audio) => {
      if (this.handlerManager.getHandler(audio) !== this.audioHandlerName) return;
      this.handlerManager.registerHandler(audio, '');
    });
  }
}
