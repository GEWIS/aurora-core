import BaseHandler from './base-handler';
import { LightsGroup } from '../root/entities/lights';
import { TrackPropertiesEvent } from '../events/MusicEmitter';

export default abstract class BaseLightsHandler extends BaseHandler<LightsGroup> {
  private trackFeatures?: TrackPropertiesEvent;

  /**
   * Set the bpm of the current song. Zero (0) if no bpm
   * @param features
   */
  public setFeatures(features: TrackPropertiesEvent): void {
    this.trackFeatures = features;
  }

  abstract tick(): LightsGroup[];
}
