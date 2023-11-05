import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { BeatEvent, TrackPropertiesEvent } from '../../events/music-emitter-events';
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

  /**
   * Create an constructor function that will create this effect with the given parameters
   * Used when you want to reference effects, but are not in the context of handlers.
   * @param color
   * @param parsColor
   */
  public static build(
    color: WheelColor,
    parsColor?: RgbColor,
  ): LightsEffectBuilder<BeatFadeOut> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new BeatFadeOut(lightsGroup, color, features, parsColor);
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
        p.fixture.setCurrentValues({
          masterDimChannel: 255 * beatProgression,
          ...rgbColorDefinitions[this.parsColor || this.color],
        });
      } else {
        p.fixture.setMasterDimmer(0);
      }
    });

    return this.lightsGroup;
  }
}
