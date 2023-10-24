import { BeatEvent, TrackPropertiesEvent } from '../../events/MusicEmitter';
import { LightsGroup } from '../entities';

export default abstract class LightsEffect {
  protected lightsGroup: LightsGroup;

  protected features?: TrackPropertiesEvent;

  protected constructor(lightsGroup: LightsGroup, features?: TrackPropertiesEvent) {
    this.lightsGroup = lightsGroup;
    this.features = features;
  }

  abstract tick(): LightsGroup;
  abstract beat(event: BeatEvent): void;
}
