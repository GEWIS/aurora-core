import LightsEffect, { BaseLightsEffectCreateParams, LightsEffectBuilder } from '../lights-effect';
import { LightsGroup, LightsGroupMovingHeadRgbs, LightsGroupPars } from '../../entities';
import { RgbColor } from '../../color-definitions';
import LightsFixture from '../../entities/lights-fixture';

export interface WaveProps {
  /**
   * Color of the lights
   */
  color: RgbColor;

  /**
   * Number of waves, ignored if singleWave=true (1 by default)
   * @isInt
   * @minimum 1
   */
  nrWaves?: number;

  /**
   * How many ms each cycle of the wave takes (1000ms by default)
   * @isInt
   * @minimum 0
   */
  cycleTime?: number;

  /**
   * Whether the animation should only be executed once from start to finish
   * instead of a continuous animation (false by default)
   */
  singleWave?: boolean;
}

export type WaveCreateParams = BaseLightsEffectCreateParams & {
  type: 'Wave';
  props: WaveProps;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_NR_WAVES = 1;
const DEFAULT_CYCLE_TIME = 1000;

export default class Wave extends LightsEffect<WaveProps> {
  private cycleStartTick: Date = new Date();

  constructor(lightsGroup: LightsGroup, props: WaveProps) {
    super(lightsGroup);
    this.props = props;
  }

  public static build(props: WaveProps): LightsEffectBuilder<WaveProps, Wave> {
    return (lightsGroup) => new Wave(lightsGroup, props);
  }

  destroy(): void {}

  beat(): void {}

  private getProgression(currentTick: Date) {
    const cycleTime = this.props.cycleTime ?? DEFAULT_CYCLE_TIME;
    return Math.min(1, (currentTick.getTime() - this.cycleStartTick.getTime()) / cycleTime);
  }

  /**
   * Get a fixture's brightness level
   * @param fixtureIndex
   * @param progression
   * @private
   */
  private getBrightness(fixtureIndex: number, progression: number) {
    const nrLights = this.lightsGroup.pars.length + this.lightsGroup.movingHeadRgbs.length;
    const nrWaves = this.props.singleWave ? 0.5 : (this.props.nrWaves ?? DEFAULT_NR_WAVES);
    // By default, the animation is a single sine wave over all lights. If we only want to show a
    // single wave, we should only show half a wave (so we start with all black and end with all
    // black).
    return Math.sin((-fixtureIndex / nrLights + progression) * 2 * nrWaves * Math.PI);
  }

  tick(): LightsGroup {
    const currentTick = new Date();
    const progression = this.getProgression(currentTick);
    if (progression >= 1 && !this.props.singleWave) {
      this.cycleStartTick = currentTick;
    }

    // Apply the wave effect to the fixture in a group
    const apply = (p: LightsGroupPars | LightsGroupMovingHeadRgbs, i: number) => {
      const brightness = this.getBrightness(i, progression);
      p.fixture.setMasterDimmer(Math.max(0, brightness * 255));
      p.fixture.setColor(this.props.color);
    };

    this.lightsGroup.pars.sort((p1, p2) => p2.firstChannel - p1.firstChannel).forEach(apply);
    this.lightsGroup.movingHeadRgbs
      .sort((p1, p2) => p2.firstChannel - p1.firstChannel)
      .forEach(apply);

    return this.lightsGroup;
  }
}
