import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup } from '../../entities';
import { MovementEffects } from './movement-effetcs';

export interface FixedPositionProps {
  /**
   * Pan value of the moving heads. Any decimals are applied to the finePan if it exists.
   * @minimum 0
   * @maximum 256
   */
  pan: number;

  /**
   * Tilt value of the moving heads. Any decimals are applied to the fineTilt if it exists.
   * @minimum 0
   * @maximum 256
   */
  tilt: number;
}

export type FixedPositionCreateParams = BaseLightsEffectCreateParams & {
  type: MovementEffects.FixedPosition;
  props: FixedPositionProps;
};

export default class FixedPosition extends LightsEffect<FixedPositionProps> {
  constructor(lightsGroup: LightsGroup, props: FixedPositionProps) {
    super(lightsGroup);
    this.props = props;

    lightsGroup.movingHeadRgbs.forEach(({ fixture }) => {
      fixture.setPosition(props.pan, props.tilt);
    });
    lightsGroup.movingHeadWheels.forEach(({ fixture }) => {
      fixture.setPosition(props.pan, props.tilt);
    });
  }

  public static build(
    props: FixedPositionProps,
  ): LightsEffectBuilder<FixedPositionProps, FixedPosition> {
    return (lightsGroup) => new FixedPosition(lightsGroup, props);
  }

  beat(): void {}

  destroy(): void {}

  tick(): LightsGroup {
    return this.lightsGroup;
  }
}
