import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';

export type LightsEffectBuilder<P = {}, T extends LightsEffect<P> = LightsEffect<P>> = (
  lightsGroup: LightsGroup,
  features?: TrackPropertiesEvent
) => T;

export type BaseLightsEffectCreateParams = {};

export default abstract class LightsEffect<P = {}> {
  public lightsGroup: LightsGroup;

  protected features?: TrackPropertiesEvent;

  protected props: P;

  public constructor(lightsGroup: LightsGroup, features?: TrackPropertiesEvent) {
    this.lightsGroup = lightsGroup;
    this.features = features;
  }

  public setNewProps(props: P) {
    this.props = props;
  }

  /**
   * Clean up effect when it is destroyed
   */
  abstract destroy(): void;
  abstract tick(): LightsGroup;
  abstract beat(event: BeatEvent): void;
}
