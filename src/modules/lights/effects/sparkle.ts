import LightsEffect, { LightsEffectBuilder } from './lights-effect';
import { RgbColor, rgbColorDefinitions } from '../color-definitions';
import { LightsGroup } from '../entities';
import { TrackPropertiesEvent } from '../../events/music-emitter-events';

/**
 * @property colors Colors of the lights
 * @property ratio What percentage (on average) of the lights should be turned on
 * @property length How many cycles the light should take to slowly turn off
 * @property cycleTime After how many ms (approximately) a ratio of lights should be turned on
 */
export interface SparkleProps {
  colors: RgbColor[],
  ratio?: number,
  length?: number,
  cycleTime?: number,
}

const DEFAULT_RATIO = 0.2;
const DEFAULT_LENGTH = 4;
const DEFAULT_CYCLE_TIME = 200;

export default class Sparkle extends LightsEffect<SparkleProps> {
  private beats: Date[];

  private colorIndices: number[];

  private previousTick = new Date();

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

    this.props = props;
  }

  public static build(props: SparkleProps): LightsEffectBuilder<SparkleProps, Sparkle> {
    return (
      lightsGroup: LightsGroup,
      features?: TrackPropertiesEvent,
    ) => new Sparkle(lightsGroup, props, features);
  }

  destroy(): void {}

  beat(): void {}

  private getProgression(beat: Date) {
    const speed = this.props.cycleTime ?? DEFAULT_CYCLE_TIME;
    const length = this.props.length ?? DEFAULT_LENGTH;

    return Math.max(
      1 - ((new Date().getTime() - beat.getTime()) / (speed * length)),
      0,
    );
  }

  tick(): LightsGroup {
    const { colors, cycleTime: propsCycleTime, ratio: propsRatio } = this.props;
    const cycleTime = propsCycleTime ?? DEFAULT_CYCLE_TIME;
    const ratio = propsRatio ?? DEFAULT_RATIO;

    // Turn on some lights according to the ratio if we have reached the time
    if (new Date().getTime() - this.previousTick.getTime() >= cycleTime) {
      this.beats.forEach((b, i) => {
        if (Math.random() <= ratio) {
          this.colorIndices[i] = (this.colorIndices[i] + i) % Math
            .max(colors.length);
          this.beats[i] = new Date();
        }
      });
      this.previousTick = new Date();
    }

    this.lightsGroup.pars.forEach((p, i) => {
      const index = i;
      const progression = this.getProgression(this.beats[index]);
      const colorIndex = this.colorIndices[index];
      const color = colors[colorIndex % colors.length];
      const { definition: colorDefinition } = rgbColorDefinitions[color];
      p.fixture.setCurrentValues({
        masterDimChannel: Math.round(255 * progression),
        ...colorDefinition,
      });
    });

    return this.lightsGroup;
  }
}
