import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel } from '../../entities';

export interface TableRotateProps {
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

export type TableRotateCreateParams = BaseLightsEffectCreateParams & {
  type: 'TableRotate';
  props: TableRotateProps;
};

const DEFAULT_CYCLE_TIME = 8000;
const DEFAULT_OFFSET_FACTOR = 0.25;

export default class TableRotate extends LightsEffect<TableRotateProps> {
  private cycleStartTick: Date = new Date();

  /**
   * @param lightsGroup
   * @param props
   */
  constructor(lightsGroup: LightsGroup, props: TableRotateProps) {
    super(lightsGroup);
    this.props = props;
  }

  public static build(
    props: TableRotateProps = {}
  ): LightsEffectBuilder<TableRotateProps, TableRotate> {
    return (lightsGroup) => new TableRotate(lightsGroup, props);
  }

  destroy(): void {}

  beat(): void {}

  private getProgression(currentTick: Date) {
    const cycleTime = this.props.cycleTime ?? DEFAULT_CYCLE_TIME;
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / cycleTime);
  }

  private setPosition(
    movingHead: LightsMovingHeadWheel | LightsMovingHeadRgb,
    progression: number,
    offset: number = 0
  ) {
    const panChannel = Math.cos(progression * 2 * Math.PI + offset) * (255 / 6) + 255 / 6;
    const tiltChannel = Math.sin(progression * 6 * Math.PI + offset) * 48 + 96;

    movingHead.setCurrentValues({
      panChannel: Math.floor(panChannel),
      finePanChannel: Math.round((panChannel % 1) * 255),
      tiltChannel: Math.floor(tiltChannel),
      fineTiltChannel: Math.round((tiltChannel % 1) * 255)
    });
  }

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    const offsetFactor = this.props.offsetFactor ?? DEFAULT_OFFSET_FACTOR;
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
