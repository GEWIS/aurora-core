import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { RgbColor, rgbColorDefinitions } from '../color-definitions';

export default class Strobe extends LightsEffect {
  private enabled = false;

  beat(): void {}

  tick(): LightsGroup {
    console.log('Strobe tick!');
    if (!this.enabled) {
      this.lightsGroup.pars.forEach((par) => {
        par.fixture.setColor(rgbColorDefinitions[RgbColor.BLINDINGWHITE].definition);
        par.fixture.setMasterDimmer(255);
        par.fixture.enableStrobe();
      });
    }
    return this.lightsGroup;
  }

  public static build(): LightsEffectBuilder {
    return (lightsGroup, features) => new Strobe(lightsGroup, features);
  }
}
