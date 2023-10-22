import { Namespace } from 'socket.io';
import BaseLightsHandler from '../base-lights-handler';
import { BeatEmitter } from '../../events';
import { LightsGroup } from '../../root/entities/lights';

export default class SimpleLightsHandler extends BaseLightsHandler {
  private ping = false;

  constructor(socket: Namespace, beatEmitter: BeatEmitter) {
    super(socket, beatEmitter);

    this.beatEmitter.on('beat', () => {
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
    });
  }

  tick(): LightsGroup[] {
    return this.entities;
  }
}
