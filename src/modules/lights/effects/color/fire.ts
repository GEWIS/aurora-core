import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { TrackPropertiesEvent } from '../../../events/music-emitter-events';
import { LightsGroup } from '../../entities';

interface FireProps {}

export type FireCreateParams = BaseLightsEffectCreateParams & {
  type: 'Fire';
  props: FireProps;
};

export default class Fire extends LightsEffect<FireProps> {
  constructor(lightsGroup: LightsGroup, props?: FireProps, features?: TrackPropertiesEvent) {
    super(lightsGroup, undefined, undefined, features);
  }

  public static build(props?: FireProps): LightsEffectBuilder<FireProps, Fire> {
    return (lightsGroup: LightsGroup, features?: TrackPropertiesEvent) =>
      new Fire(lightsGroup, props, features);
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
