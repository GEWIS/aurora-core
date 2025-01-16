import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';
import EffectProgressionStrategy from './progression-strategies/effect-progression-strategy';
import LightsGroupFixture from '../entities/lights-group-fixture';
import { LightsEffectPattern } from './lights-effect-pattern';
import EffectProgressionMapStrategy from './progression-strategies/mappers/effect-progression-map-strategy';
import EffectProgressionMapFactory from './progression-strategies/mappers/effect-progression-map-factory';

export type LightsEffectBuilder<P = {}, T extends LightsEffect<P> = LightsEffect<P>> = (
  lightsGroup: LightsGroup,
  features?: TrackPropertiesEvent,
) => T;

export type BaseLightsEffectCreateParams = {};

export default abstract class LightsEffect<P = {}> {
  protected props: P;

  private readonly progressionMapperStrategy: EffectProgressionMapStrategy;

  protected constructor(
    public readonly lightsGroup: LightsGroup,
    private readonly progressionStrategy?: EffectProgressionStrategy,
    progressionMapperStrategy?: EffectProgressionMapStrategy,
    protected features?: TrackPropertiesEvent,
  ) {
    if (!progressionMapperStrategy) {
      this.progressionMapperStrategy = new EffectProgressionMapFactory(this.lightsGroup).getMapper(
        LightsEffectPattern.HORIZONTAL,
      );
    } else {
      this.progressionMapperStrategy = progressionMapperStrategy;
    }
  }

  public setNewProps(props: P) {
    this.props = props;
  }

  protected getEffectNrFixtures(): number {
    return this.progressionMapperStrategy.getNrFixtures();
  }

  protected getProgression(currentTick: Date, fixture: LightsGroupFixture): number {
    if (!this.progressionStrategy) return 0;

    const progression = this.progressionStrategy.getProgression(currentTick);
    const fixtureProgression = this.progressionMapperStrategy.getProgression(progression, fixture);
    return fixtureProgression;
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
