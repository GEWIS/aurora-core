import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { RgbColorSpecification } from '../color-definitions';
import { LightsGroup } from '../entities';
import { TrackPropertiesEvent } from '../../events/music-emitter-events';

/**
 * @property colors Colors of the lights
 * @property ratio What percentage (on average) of the lights should be turned on
 * @property length How many cycles the light should take to slowly turn off
 * @property speed After how many ms (approximately) a ratio of lights should be turned on
 */
export interface SparkleProps {
  colors: RgbColorSpecification[],
  ratio?: number,
  length?: number,
  speed?: number,
}

export default class Sparkle extends LightsEffect {
  private beats: Date[];

  private colorIndices: number[];

  private previousTick = new Date();

  private colors: RgbColorSpecification[];

  private ratio = 0.2;

  private length = 4;

  private speed = 200;

  /**
   * @param lightsGroup The group of lights this effect will be applied to
   * @param props
   * @param features
   */
  constructor(
    lightsGroup: LightsGroup,
    props: SparkleProps,
    features?: TrackPropertiesEvent,
  ) {
    super(lightsGroup, features);

    const nrFixtures = lightsGroup.pars.length
      + lightsGroup.movingHeadWheels.length
      + lightsGroup.movingHeadRgbs.length;
    this.beats = new Array(nrFixtures).fill(new Date(0));
    this.colorIndices = new Array(nrFixtures).fill(0);

    this.colors = props.colors;
    if (props.ratio !== undefined) this.ratio = props.ratio;
    if (props.length !== undefined) this.length = props.length;
    if (props.speed !== undefined) this.speed = props.speed;
  }

  public static build(props: SparkleProps): LightsEffectBuilder<Sparkle> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new Sparkle(lightsGroup, props, features);
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
            .max(this.colors.length);
          this.beats[i] = new Date();
        }
      });
      this.previousTick = new Date();
    }

    this.lightsGroup.pars.forEach((p, i) => {
      const index = i;
      const progression = this.getProgression(this.beats[index]);
      const colorIndex = this.colorIndices[index];
      p.fixture.setCurrentValues({
        masterDimChannel: Math.round(255 * progression),
        ...this.colors[colorIndex % this.colors.length].definition,
      });
    });

    return this.lightsGroup;
  }
}
