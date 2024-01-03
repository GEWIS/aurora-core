import { LightsGroup } from '../lights/entities';
import { Audio, Screen } from '../root/entities';
import HandlerManager from '../root/handler-manager';

export default abstract class BaseMode {
  protected lights: LightsGroup[];

  protected screens: Screen[];

  protected audios: Audio[];

  protected handlerManager = HandlerManager.getInstance();

  protected constructor(lights: LightsGroup[], screens: Screen[], audios: Audio[]) {
    this.lights = lights;
    this.screens = screens;
    this.audios = audios;
  }

  abstract destroy(): void;
}
