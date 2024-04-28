import { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel } from '../../entities';
import BaseRotate, { BaseRotateProps } from './base-rotate';

export interface TableRotateProps extends BaseRotateProps {}

export type TableRotateCreateParams = BaseLightsEffectCreateParams & {
  type: 'TableRotate';
  props: TableRotateProps;
};

const DEFAULT_CYCLE_TIME = 8000;
const DEFAULT_OFFSET_FACTOR = 0.25;

export default class TableRotate extends BaseRotate<TableRotateProps> {
  /**
   * @param lightsGroup
   * @param props
   */
  constructor(lightsGroup: LightsGroup, props: TableRotateProps) {
    super(lightsGroup, { cycleTime: DEFAULT_CYCLE_TIME, offsetFactor: DEFAULT_OFFSET_FACTOR });
    this.props = props;
  }

  public static build(
    props: TableRotateProps = {},
  ): LightsEffectBuilder<TableRotateProps, TableRotate> {
    return (lightsGroup) => new TableRotate(lightsGroup, props);
  }

  protected setPosition(
    movingHead: LightsMovingHeadWheel | LightsMovingHeadRgb,
    progression: number,
    offset: number = 0,
  ) {
    const panChannel = Math.cos(progression * 2 * Math.PI + offset) * (255 / 6) + 255 / 6;
    const tiltChannel = Math.sin(progression * 6 * Math.PI + offset) * 48 + 96;

    movingHead.setPosition(panChannel, tiltChannel);
  }
}
