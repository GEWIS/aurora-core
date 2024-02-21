import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { RgbColor } from '../../color-definitions';
import { LightsGroup } from '../../entities';
import { TrackPropertiesEvent } from '../../../events/music-emitter-events';

export interface SparkleProps {
  /**
   * Colors of the lights
   */
  colors: RgbColor[],

  /**
   * What percentage (on average) of the lights should be turned on
   * @minimum 0
   * @maximum 1
   */
  ratio?: number,

  /**
   * How many ms the light should take to slowly turn off
   * @isInt
   * @minimum 1
   */
  dimDuration?: number,

  /**
   * After how many ms (approximately) a ratio of lights should be turned on
   * @isInt
   * @minimum 0
   */
  cycleTime?: number,
}

export type SparkleCreateParams = BaseLightsEffectCreateParams & {
  type: 'Sparkle';
  props: SparkleProps;
};

const DEFAULT_RATIO = 0.2;
const DEFAULT_DIM_DURATION = 800;
const DEFAULT_CYCLE_TIME = 200;

export default class Sparkle extends LightsEffect<SparkleProps> {
  private beatsPars: Date[];

  private beatsMHRgbs: Date[];

  private colorIndicesPars: number[];

  private colorIndicesMHRgbs: number[];

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
    this.beatsPars = new Array(nrFixtures).fill(new Date(0));
    this.colorIndicesPars = new Array(nrFixtures).fill(0);

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
    const dimDuration = this.props.dimDuration ?? DEFAULT_DIM_DURATION;

    return Math.max(
      1 - ((new Date().getTime() - beat.getTime()) / (dimDuration)),
      0,
    );
  }

  tick(): LightsGroup {
    const { colors, cycleTime: propsCycleTime, ratio: propsRatio } = this.props;
    const cycleTime = propsCycleTime ?? DEFAULT_CYCLE_TIME;
    const ratio = propsRatio ?? DEFAULT_RATIO;

    // Turn on some lights according to the ratio if we have reached the time
    if (new Date().getTime() - this.previousTick.getTime() >= cycleTime) {
      this.beatsPars?.forEach((b, i) => {
        if (Math.random() <= ratio) {
          this.colorIndicesPars[i] = (this.colorIndicesPars[i] + i) % Math
            .max(colors.length);
          this.beatsPars[i] = new Date();
        }
      });
      this.beatsMHRgbs?.forEach((b, i) => {
        if (Math.random() <= ratio) {
          this.colorIndicesMHRgbs[i] = (this.colorIndicesMHRgbs[i] + i) % Math
            .max(colors.length);
          this.beatsMHRgbs[i] = new Date();
        }
      });
      this.previousTick = new Date();
    }

    this.lightsGroup.pars.forEach((p, i) => {
      const index = i;
      const progression = this.getProgression(this.beatsPars[index]);
      const colorIndex = this.colorIndicesPars[index];
      const color = colors[colorIndex % colors.length];
      p.fixture.setColor(color);
      p.fixture.setMasterDimmer(Math.round(255 * progression));
    });
    this.lightsGroup.movingHeadRgbs.forEach((p, i) => {
      const index = i;
      const progression = this.getProgression(this.beatsMHRgbs[index]);
      const colorIndex = this.colorIndicesMHRgbs[index];
      const color = colors[colorIndex % colors.length];
      p.fixture.setColor(color);
      p.fixture.setMasterDimmer(Math.round(255 * progression));
    });

    return this.lightsGroup;
  }
}
