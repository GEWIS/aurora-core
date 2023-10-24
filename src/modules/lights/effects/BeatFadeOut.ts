import LightsEffect from './LightsEffect';
import { BeatEvent, TrackPropertiesEvent } from '../../events/MusicEmitter';
import { LightsGroup } from '../entities';
import { RgbColor, rgbColorDefinitions, WheelColor } from '../ColorDefinitions';

export default class BeatFadeOut extends LightsEffect {
  private color: WheelColor;

  private parsColor?: RgbColor;

  private ping = false;

  private lastBeat = new Date().getTime(); // in ms since epoch;

  private beatLength: number = 1; // in ms;

  constructor(
    lightsGroup: LightsGroup,
    color: WheelColor,
    features?: TrackPropertiesEvent,
    parsColor?: RgbColor,
  ) {
    super(lightsGroup, features);
    this.color = color;
    this.parsColor = parsColor;
  }

  beat(event: BeatEvent): void {
    this.lastBeat = new Date().getTime();
    this.beatLength = event.beat.duration * 1000;
    this.ping = !this.ping;
  }

  tick(): LightsGroup {
    const beatProgression = Math.max(
      1 - ((new Date().getTime() - this.lastBeat) / this.beatLength),
      0,
    );

    this.lightsGroup.pars.forEach((p, i) => {
      if (i % 2 === (this.ping ? 1 : 0)) {
        p.par.setCurrentValues({
          masterDimChannel: 255 * beatProgression,
          ...rgbColorDefinitions[this.parsColor || this.color],
        });
      } else {
        p.par.setMasterDimmer(0);
      }
    });

    return this.lightsGroup;
  }
}
