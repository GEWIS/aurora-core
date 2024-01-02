import BaseHandler from './base-handler';
import { LightsGroup } from '../lights/entities';
import { TrackPropertiesEvent } from '../events/music-emitter-events';

export default abstract class BaseLightsHandler extends BaseHandler<LightsGroup> {
  protected trackFeatures?: TrackPropertiesEvent;

  /**
   * Set the bpm of the current song. Zero (0) if no bpm
   * @param features
   */
  public setFeatures(features: TrackPropertiesEvent): void {
    this.trackFeatures = features;
  }

  /**
   * Second event loop to calculate the current DMX values.
   * Always runs at a frequency of 40Hz.
   */
  abstract tick(): LightsGroup[];

  public removeEntity(entity: LightsGroup) {
    // Reset all the lights
    entity.pars.forEach((f) => {
      f.fixture.blackout();
      f.fixture.clearOverrideDmx();
    });
    entity.movingHeadRgbs.forEach((f) => {
      f.fixture.blackout();
      f.fixture.clearOverrideDmx();
    });
    entity.movingHeadWheels.forEach((f) => {
      f.fixture.blackout();
      f.fixture.clearOverrideDmx();
    });

    super.removeEntity(entity);
  }
}
