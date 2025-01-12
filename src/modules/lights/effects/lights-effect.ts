import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';
import EffectProgressionStrategy from './progression-strategies/effect-progression-strategy';

export type LightsEffectBuilder<P = {}, T extends LightsEffect<P> = LightsEffect<P>> = (
  lightsGroup: LightsGroup,
  features?: TrackPropertiesEvent,
) => T;

export type BaseLightsEffectCreateParams = {};

export default abstract class LightsEffect<P = {}> {
  protected props: P;

  protected constructor(
    public lightsGroup: LightsGroup,
    private progressionStrategy?: EffectProgressionStrategy,
    protected features?: TrackPropertiesEvent,
  ) {}

  public setNewProps(props: P) {
    this.props = props;
  }

  protected getProgression(currentTick: Date): number {
    if (!this.progressionStrategy) return 0;
    return this.progressionStrategy.getProgression(currentTick);
  }

  /**
   * Clean up effect when it is destroyed
   */
  abstract destroy(): void;

  /**
   * Process the tick in the effect's progression
   */
  public tick(): LightsGroup {
    this.progressionStrategy?.tick();
    return this.lightsGroup;
  }

  /**
   * Process the beat in the effect's progression
   * @param event
   */
  public beat(event: BeatEvent): void {
    this.progressionStrategy?.beat(event);
  }
}
