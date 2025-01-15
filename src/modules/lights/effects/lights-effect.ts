import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../entities';
import EffectProgressionStrategy from './progression-strategies/effect-progression-strategy';
import LightsGroupFixture from '../entities/lights-group-fixture';
import { LightsEffectPattern } from './lights-effect-pattern';

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
    private pattern: LightsEffectPattern = LightsEffectPattern.HORIZONTAL,
    protected features?: TrackPropertiesEvent,
  ) {}

  public setNewProps(props: P) {
    this.props = props;
  }

  private getCenter(): { x: number; y: number } {
    return {
      x: (this.lightsGroup.gridSizeX - 1) / 2,
      y: (this.lightsGroup.gridSizeY - 1) / 2,
    };
  }

  protected getProgression(currentTick: Date, fixture: LightsGroupFixture): number {
    if (!this.progressionStrategy) return 0;

    const progression = this.progressionStrategy.getProgression(currentTick);
    let relativePosition: number = fixture.positionX / this.lightsGroup.gridSizeX;

    const { x: centerX, y: centerY } = this.getCenter();

    switch (this.pattern) {
      case LightsEffectPattern.HORIZONTAL:
        relativePosition = fixture.positionX / this.lightsGroup.gridSizeX;
        break;
      case LightsEffectPattern.VERTICAL:
        relativePosition = fixture.positionY / this.lightsGroup.gridSizeY;
        break;
      case LightsEffectPattern.DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT:
        relativePosition =
          (fixture.positionX + fixture.positionY) /
          (this.lightsGroup.gridSizeX + this.lightsGroup.gridSizeY);
        break;
      case LightsEffectPattern.DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT:
        relativePosition =
          (fixture.positionX - fixture.positionY) /
          (this.lightsGroup.gridSizeX + this.lightsGroup.gridSizeY);
        break;
      case LightsEffectPattern.CENTERED_SQUARED:
        const distanceX_1 = Math.abs(fixture.positionX - centerX);
        const distanceY_1 = Math.abs(fixture.positionY - centerY);
        relativePosition =
          (distanceX_1 + distanceY_1) /
          ((this.lightsGroup.gridSizeX + this.lightsGroup.gridSizeY) / 2);
        break;
      case LightsEffectPattern.CENTERED_CIRCULAR:
        const distanceX_2 = fixture.positionX - centerX;
        const distanceY_2 = fixture.positionY - centerY;
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
        relativePosition = Math.sqrt(distanceX_2 ** 2 + distanceY_2 ** 2) / maxDistance;
        break;
      case LightsEffectPattern.ROTATIONAL:
        const x = fixture.positionX - centerX;
        const y = fixture.positionY - centerY;
        const angle = Math.atan2(x, y) / Math.PI;
        // Transform range [-1, 1] to [0, 1]
        relativePosition = (angle + 1) / 2;
        break;
    }

    return (relativePosition + progression) % 1;
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
