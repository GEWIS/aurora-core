import BaseLightsHandler from '../base-lights-handler';
import { LightsGroup } from '../../root/entities/lights';

export default class SimpleLightsHandler extends BaseLightsHandler {
  private ping = false;

  tick(): LightsGroup[] {
    return this.entities;
  }

  beat(): void {
    this.entities.forEach((g) => {
      g.pars.forEach((p, i) => {
        if (i % 2 === (this.ping ? 1 : 0)) {
          p.par.setCurrentValues({ masterDimChannel: 255, redChannel: 255 });
        } else {
          p.par.setCurrentValues({ masterDimChannel: 255, redChannel: 0 });
        }
      });
    });
    this.ping = !this.ping;
  }
}
