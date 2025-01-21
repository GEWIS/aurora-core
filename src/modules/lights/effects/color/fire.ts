import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup } from '../../entities';

interface FireProps {}

export type FireCreateParams = BaseLightsEffectCreateParams & {
  type: 'Fire';
  props: FireProps;
};

export default class Fire extends LightsEffect<FireProps> {
  constructor(lightsGroup: LightsGroup, props?: FireProps) {
    super(lightsGroup);
  }

  public static build(props?: FireProps): LightsEffectBuilder<FireProps, Fire> {
    return (lightsGroup: LightsGroup) => new Fire(lightsGroup, props);
  }

  beat(): void {}

  destroy(): void {}

  tick(): LightsGroup {
    this.lightsGroup.pars.forEach((p) => {
      p.fixture.setCurrentValues({
        masterDimChannel: 128,
        redChannel: 255,
        greenChannel: 32 + Math.round(Math.random() * 64),
        amberChannel: 128,
      });
    });
    return this.lightsGroup;
  }
}
