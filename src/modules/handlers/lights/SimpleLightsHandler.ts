import BaseLightsHandler from '../base-lights-handler';
import { LightsGroup } from '../../root/entities/lights';
import { BeatEvent } from '../../events/MusicEmitter';

export default class SimpleLightsHandler extends BaseLightsHandler {
  private ping = false;

  private lastBeat = new Date().getTime(); // in ms since epoch;

  private beatLength: number = 1; // in ms;

  tick(): LightsGroup[] {
    const beatProgression = Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    );

    return this.entities.map((g) => {
      g.pars.forEach((p, i) => {
        if (i % 2 === (this.ping ? 1 : 0)) {
          p.par.setCurrentValues({
            masterDimChannel: 255,
            redChannel: Math.round(255 * beatProgression),
          });
        } else {
          p.par.setCurrentValues({ masterDimChannel: 255, redChannel: 0 });
        }
      });
      return g;
    });
  }

  beat(event: BeatEvent): void {
    this.lastBeat = new Date().getTime();
    this.beatLength = event.beat.duration * 1000;
    this.ping = !this.ping;
  }
}
