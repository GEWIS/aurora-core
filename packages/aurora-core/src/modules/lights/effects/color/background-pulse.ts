import LightsEffect, {
  BaseLightsEffectCreateParams,
  BaseLightsEffectProps,
  LightsEffectBuilder,
} from '../lights-effect';
import { LightsGroup } from '../../entities';
import { hexToRgb, RgbColor, rgbColorDefinitions, RgbColorSpecification } from '../../color-definitions';
import { EffectProgressionTickStrategy } from '../progression-strategies';
import { IColorsRgb } from '../../entities/colors-rgb';
import { ColorEffects } from './color-effects';

export interface BackgroundPulseProps extends BaseLightsEffectProps {
  /**
   * What percentage (on average) of the lights should be turned on
   * @minimum 0
   * @maximum 1
   */
  ratio?: number;

  /**
   * How many ms the lights should take to turn on and aff
   * @isInt
   * @minimum 1
   */
  pulseDuration?: number;

  /**
   * After how many ms (approximately) a ratio of lights should start pulsing.
   * @isInt
   * @minimum 0
   */
  cycleTime?: number;
}

export type BackgroundPulseCreateParams = BaseLightsEffectCreateParams & {
  type: ColorEffects.BackgroundPulse;
  props: BackgroundPulseProps;
};

const DEFAULT_RATIO = 0.05;
const DEFAULT_PULSE_DURATION = 8000;
const DEFAULT_CYCLE_TIME = 800;

export default class BackgroundPulse extends LightsEffect<BackgroundPulseProps> {
  private progressions: (EffectProgressionTickStrategy | undefined)[];

  private colorIndices: number[];

  private cycleStartTick: Date = new Date();

  constructor(lightsGroup: LightsGroup, props: BackgroundPulseProps) {
    super(lightsGroup);

    const nrFixtures = lightsGroup.pars.length + lightsGroup.movingHeadRgbs.length;
    const nrPulseColors = props.colors.length - 1;
    this.progressions = new Array(nrFixtures).fill(undefined);
    this.colorIndices = new Array(nrFixtures).fill(0).map(() => {
      return Math.floor(Math.random() * nrPulseColors);
    });

    this.props = props;
  }

  public static build(props: BackgroundPulseProps): LightsEffectBuilder<BackgroundPulseProps, BackgroundPulse> {
    return (lightsGroup: LightsGroup) => new BackgroundPulse(lightsGroup, props);
  }

  setColors(colors: RgbColor[]) {
    this.props.colors = colors;
  }

  destroy(): void {
    this.lightsGroup.fixtures.forEach((f) => {
      f.fixture.setBrightness(1);
      f.fixture.resetColor();
    });
  }

  /**
   * Whether we should start a new tick
   * @private
   */
  private shouldStartNewCycle(): boolean {
    const now = new Date();
    const ms = now.getTime() - this.cycleStartTick.getTime();
    return ms > (this.props.cycleTime || DEFAULT_CYCLE_TIME);
  }

  /**
   * Have a subset of fixtures start a new pulse, if they are not pulsing already
   * @private
   */
  private startNewCycle(): void {
    this.cycleStartTick = new Date();

    const candidateFixtureIndices = this.progressions
      .map((p, i) => i)
      .filter((i) => {
        const p = this.progressions[i];
        return !p || p.getProgression(this.cycleStartTick) >= 1;
      });

    let nrFixturesToStart = this.progressions.length * (this.props.ratio || DEFAULT_RATIO);
    const extraFixture = nrFixturesToStart % 1 > Math.random();
    if (extraFixture) {
      nrFixturesToStart = Math.ceil(nrFixturesToStart);
    } else {
      nrFixturesToStart = Math.floor(nrFixturesToStart);
    }

    const fixtureIndicesPermutation = candidateFixtureIndices.sort(() => Math.random() - 0.5);
    const fixturesToStart = fixtureIndicesPermutation.slice(0, nrFixturesToStart);
    fixturesToStart.forEach((i) => {
      this.progressions[i] = new EffectProgressionTickStrategy(
        this.props.pulseDuration || DEFAULT_PULSE_DURATION,
        true,
      );
      // Next color. Note that the first color is always the background color
      this.colorIndices[i] = (this.colorIndices[i] + 1) % (this.props.colors.length - 1);
    });
  }

  /**
   * Transform a [0, 1] linear progression to a [0, 1] and [1, 0] linear progression
   * @param fixtureAbsoluteProgression
   * @protected
   */
  protected getRelativeProgression(fixtureAbsoluteProgression: number) {
    if (fixtureAbsoluteProgression < 0.5) {
      return fixtureAbsoluteProgression * 2;
    }
    return (1 - fixtureAbsoluteProgression) * 2;
  }

  private rgbToIColorsRgb({ r, g, b }: { r: number; b: number; g: number }): Required<IColorsRgb> {
    return {
      redChannel: r,
      greenChannel: g,
      blueChannel: b,
      coldWhiteChannel: 0,
      warmWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    };
  }

  /**
   * Mix two colors together
   * @param colorA
   * @param colorB
   * @param p factor B present in the new color
   * @param rgbOnly Whether the output should be an RGB-only color
   * @private
   */
  private mixColors(
    colorA: RgbColorSpecification,
    colorB: RgbColorSpecification,
    p: number,
    rgbOnly: boolean,
  ): Required<IColorsRgb> {
    if (!rgbOnly) {
      return {
        redChannel: colorA.definition.redChannel * (1 - p) + colorB.definition.redChannel * p,
        greenChannel: colorA.definition.greenChannel * (1 - p) + colorB.definition.greenChannel * p,
        blueChannel: colorA.definition.blueChannel * (1 - p) + colorB.definition.blueChannel * p,
        warmWhiteChannel: colorA.definition.warmWhiteChannel! * (1 - p) + colorB.definition.warmWhiteChannel! * p,
        coldWhiteChannel: colorA.definition.coldWhiteChannel! * (1 - p) + colorB.definition.coldWhiteChannel! * p,
        amberChannel: colorA.definition.amberChannel! * (1 - p) + colorB.definition.amberChannel! * p,
        uvChannel: colorA.definition.uvChannel! * (1 - p) + colorB.definition.uvChannel! * p,
      };
    }

    const rgbA = hexToRgb(colorA.hex);
    const rgbB = hexToRgb(colorB.hex);

    return this.rgbToIColorsRgb({
      r: rgbA.r * (1 - p) + rgbB.r * p,
      g: rgbA.g * (1 - p) + rgbB.g * p,
      b: rgbA.b * (1 - p) + rgbB.b * p,
    });
  }

  /**
   * Get the mixed color for the given progression and the given color index
   * @param p progression, in range [0, 1]
   * @param colorIndex
   * @param rgbOnly Whether only an RGB color should be returned, instead of an extensive palette
   * @private
   */
  private getColor(p: number, colorIndex: number, rgbOnly: boolean): Required<IColorsRgb> | undefined {
    const baseColor = rgbColorDefinitions[this.props.colors[0]];
    if (!baseColor) return undefined;

    let compositeColor: RgbColorSpecification | undefined;
    if (this.props.colors.length >= 2) {
      compositeColor = rgbColorDefinitions[this.props.colors[colorIndex]];
    }

    if (p <= 0 || !compositeColor) {
      return rgbOnly ? this.rgbToIColorsRgb(hexToRgb(baseColor.hex)) : baseColor.definition;
    }

    return this.mixColors(baseColor, compositeColor, p, rgbOnly);
  }

  tick(): LightsGroup {
    if (this.shouldStartNewCycle()) {
      this.startNewCycle();
    }

    const tick = new Date();

    [...this.lightsGroup.pars, ...this.lightsGroup.movingHeadRgbs].forEach((f, i) => {
      const progressionStrategy = this.progressions[i];

      let p = 0;
      if (progressionStrategy) {
        p = this.getRelativeProgression(progressionStrategy.getProgression(tick));
      }

      const color = this.getColor(p, this.colorIndices[i] + 1, !f.fixture.color.hasExtendedColorPalette());
      if (color) {
        f.fixture.setCustomColor(color);
      } else {
        f.fixture.resetColor();
      }
    });

    return this.lightsGroup;
  }
}
