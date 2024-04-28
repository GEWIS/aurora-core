import LightsEffect from '../lights-effect';
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel } from '../../entities';

export interface BaseRotateProps {
  /**
   * Time for the moving head to go around (in milliseconds)
   * @isInt must be an integer
   * @minimum 0 must be positive
   */

  cycleTime?: number;
  /**
   * What phase the lights should move apart from each other. 0 for synchronous
   */
  offsetFactor?: number;
}

/**
 * Base movement effect that implements all logic required to make a moving head
 * rotate in a certain pattern. The pattern can be easily defined using the
 * setPosition() function.
 */
export default abstract class BaseRotate<T extends BaseRotateProps> extends LightsEffect<T> {
  private cycleStartTick: Date = new Date();

  protected constructor(
    lightsGroup: LightsGroup,
    protected readonly defaults: Required<BaseRotateProps>,
  ) {
    super(lightsGroup);
  }

  protected getProgression(currentTick: Date) {
    const cycleTime = this.props.cycleTime ?? this.defaults.cycleTime;
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / cycleTime);
  }

  /**
   * Set the pan/tilt of the current moving head
   * @param movingHead
   * @param progression Progression within the effect, [0, 1)
   * @param offset Offset factor applied only to this moving head
   * @protected
   */
  protected abstract setPosition(
    movingHead: LightsMovingHeadWheel | LightsMovingHeadRgb,
    progression: number,
    offset: number,
  ): void;

  destroy(): void {}

  beat(): void {}

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    const offsetFactor = this.props.offsetFactor ?? this.defaults.offsetFactor;
    if (progression >= 1) {
      this.cycleStartTick = currentTick;
    }

    this.lightsGroup.movingHeadWheels.forEach((m, i) => {
      this.setPosition(m.fixture, progression, i * offsetFactor * 2 * Math.PI);
    });

    this.lightsGroup.movingHeadRgbs.forEach((m, i) => {
      const index = i + this.lightsGroup.movingHeadWheels.length;
      this.setPosition(m.fixture, progression, index * offsetFactor * 2 * Math.PI);
    });

    return this.lightsGroup;
  }
}
