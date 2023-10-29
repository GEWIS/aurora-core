import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { LightsGroup } from '../entities';
import { rgbColorDefinitions } from '../ColorDefinitions';

export default class Strobe extends LightsEffect {
  private enabled = false;

  beat(): void {}

  tick(): LightsGroup {
    console.log('Strobe tick!');
    if (!this.enabled) {
      this.lightsGroup.pars.forEach((par) => {
        par.par.setColor(rgbColorDefinitions.blindingWhite);
        par.par.setMasterDimmer(255);
        par.par.enableStrobe();
      });
    }
    return this.lightsGroup;
  }

  public static build(): LightsEffectBuilder {
    return (lightsGroup, features) => new Strobe(lightsGroup, features);
  }
}
