import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { RgbColor, rgbColorDefinitions, WheelColor } from '../ColorDefinitions';
import { LightsGroup } from '../entities';
import { TrackPropertiesEvent } from '../../events/music-emitter-events';

export default class Sparkle extends LightsEffect {
  private beats: Date[];

  private colorIndices: number[];

  private previousTick = new Date();

  /**
   * @param lightsGroup The group of lights this effect will be applied to
   * @param colors Color of the light (in wheel)
   * @param ratio What percentage (on average) of the lights should be turned on
   * @param length How many cycles the light should take to slowly turn off
   * @param speed After how many ms (approximately) a ratio of lights should be turned on
   * @param features
   * @param parsColors Extended color palette (rgb)
   */
  constructor(
    lightsGroup: LightsGroup,
    private colors: WheelColor[],
    private ratio = 0.2,
    private length = 4,
    private speed = 200,
    features?: TrackPropertiesEvent,
    private parsColors?: RgbColor[],
  ) {
    super(lightsGroup, features);

    const nrFixtures = lightsGroup.pars.length
      + lightsGroup.movingHeadWheels.length
      + lightsGroup.movingHeadRgbs.length;
    this.beats = new Array(nrFixtures).fill(new Date(0));
    this.colorIndices = new Array(nrFixtures).fill(0);
  }

  public static build(
    color: WheelColor[],
    ratio?: number,
    length?: number,
    speed?: number,
    parsColor?: RgbColor[],
  ): LightsEffectBuilder<Sparkle> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new Sparkle(lightsGroup, color, ratio, length, speed, features, parsColor);
  }

  beat(): void {
  }

  private getProgression(beat: Date) {
    return Math.max(
      1 - ((new Date().getTime() - beat.getTime()) / (this.speed * this.length)),
      0,
    );
  }

  tick(): LightsGroup {
    // Turn on some lights according to the ratio if we have reached the time
    if (new Date().getTime() - this.previousTick.getTime() >= this.speed) {
      this.beats.forEach((b, i) => {
        if (Math.random() <= this.ratio) {
          this.colorIndices[i] = (this.colorIndices[i] + i) % Math
            .max(this.colors.length, this.parsColors?.length || -1);
          this.beats[i] = new Date();
        }
      });
      this.previousTick = new Date();
    }

    const nrPars = this.lightsGroup.pars.length;
    this.lightsGroup.pars.forEach((p, i) => {
      const index = i;
      const progression = this.getProgression(this.beats[index]);
      const colorIndex = this.colorIndices[index];
      p.fixture.setCurrentValues({
        masterDimChannel: Math.round(255 * progression),
        ...rgbColorDefinitions[this.parsColors
          ? this.parsColors[colorIndex] : this.colors[colorIndex]],
      });
    });

    const nrMovingHeads = this.lightsGroup.movingHeadWheels.length;
    this.lightsGroup.movingHeadWheels.forEach((p, i) => {
      const index = i + nrPars;
      const progression = this.getProgression(this.beats[index]);
      const colorIndex = this.colorIndices[index];
      p.fixture.setCurrentValues({
        masterDimChannel: Math.round(255 * progression),
        ...rgbColorDefinitions[this.parsColors
          ? this.parsColors[colorIndex] : this.colors[colorIndex]],
      });
    });

    this.lightsGroup.movingHeadRgbs.forEach((p, i) => {
      const index = i + nrPars + nrMovingHeads;
      const progression = this.getProgression(this.beats[index]);
      const colorIndex = this.colorIndices[index];
      p.fixture.setCurrentValues({
        masterDimChannel: Math.round(255 * progression),
        ...rgbColorDefinitions[this.parsColors
          ? this.parsColors[colorIndex] : this.colors[colorIndex]],
      });
    });

    return this.lightsGroup;
  }
}
