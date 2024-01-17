import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';

export type LightsEffectBuilder<T extends LightsEffect = LightsEffect> = (
  lightsGroup: LightsGroup,
  features?: TrackPropertiesEvent
) => T;

export default abstract class LightsEffect {
  public lightsGroup: LightsGroup;

  protected features?: TrackPropertiesEvent;

  public constructor(lightsGroup: LightsGroup, features?: TrackPropertiesEvent) {
    this.lightsGroup = lightsGroup;
    this.features = features;
  }

  /**
   * Clean up effect when it is destroyed
   */
  abstract destroy(): void;
  abstract tick(): LightsGroup;
  abstract beat(event: BeatEvent): void;
}
