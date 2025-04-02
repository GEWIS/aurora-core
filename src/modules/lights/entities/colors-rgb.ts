import { Column } from 'typeorm';
import { hexToRgb, RgbColor, rgbColorDefinitions } from '../color-definitions';
import LightsFixtureShutterOptions, { ShutterOption } from './lights-fixture-shutter-options';
import Colors from './colors';
import logger from '../../../logger';

export type ColorChannel = keyof ColorsRgb;

export interface IColorsRgb {
  redChannel: number;
  greenChannel: number;
  blueChannel: number;
  coldWhiteChannel?: number | null;
  warmWhiteChannel?: number | null;
  amberChannel?: number | null;
  uvChannel?: number | null;
}

export default class ColorsRgb extends Colors implements IColorsRgb {
  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  public masterDimChannel?: number;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  public shutterChannel?: number;

  @Column({ type: 'tinyint', unsigned: true })
  public redChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public greenChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public blueChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public coldWhiteChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public warmWhiteChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public amberChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public uvChannel?: number | null;

  private strobePing = false;

  private currentValues: Required<IColorsRgb> = {
    redChannel: 0,
    greenChannel: 0,
    blueChannel: 0,
    coldWhiteChannel: 0,
    warmWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  };

  /**
   * Returns whether multiple LED colors can be used to mix colors, or whether only
   * RGB can be used.
   */
  public hasExtendedColorPalette(): boolean {
    return (
      this.coldWhiteChannel != null || this.warmWhiteChannel != null || this.amberChannel != null
    );
  }

  public setColor(color?: RgbColor): void {
    this.valuesUpdatedAt = new Date();

    if (!color) {
      this.reset();
      return;
    }
    const spec = rgbColorDefinitions[color];
    if (!spec) {
      logger.error(`Color "${color}" not found in rgbColorDefinitions.`);
      this.reset();
      return;
    }

    if (this.hasExtendedColorPalette()) {
      this.currentValues = spec.definition;
    } else {
      const { r, g, b } = hexToRgb(spec.hex);
      this.currentValues = {
        redChannel: r,
        greenChannel: g,
        blueChannel: b,
        coldWhiteChannel: 0,
        warmWhiteChannel: 0,
        amberChannel: 0,
        uvChannel: 0,
      };
    }
  }

  public setCustomColor(color: IColorsRgb): void {
    this.valuesUpdatedAt = new Date();

    const givenColors = Object.keys(color) as (keyof IColorsRgb)[];
    givenColors.forEach((key: keyof IColorsRgb) => {
      this.currentValues[key] = color[key]!;
    });
  }

  public reset(): void {
    this.valuesUpdatedAt = new Date();

    this.setBrightness(1);
    this.currentValues = {
      redChannel: 0,
      greenChannel: 0,
      blueChannel: 0,
      coldWhiteChannel: 0,
      warmWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    };
  }

  private getColor(color: keyof Required<IColorsRgb>): number {
    let value = this.currentValues[color]!;
    if (this.masterDimChannel) return value;
    value = Math.round(value * this.currentBrightness);
    return value;
  }

  public setStrobeInDmx(
    masterRelativeBrightness: number,
    values: number[],
    shutterOptions: LightsFixtureShutterOptions[],
  ): number[] {
    const brightnessValue = Math.round(masterRelativeBrightness * 255);
    if (this.masterDimChannel) values[this.masterDimChannel - 1] = brightnessValue;
    if (this.shutterChannel)
      values[this.shutterChannel - 1] =
        shutterOptions.find((o) => o.shutterOption === ShutterOption.STROBE)?.channelValue ?? 0;

    if (this.shutterChannel) {
      // If we have a shutter channel
      values[this.redChannel - 1] = 255;
      values[this.blueChannel - 1] = 255;
      values[this.greenChannel - 1] = 255;
      if (this.warmWhiteChannel) values[this.warmWhiteChannel - 1] = 255;
      if (this.coldWhiteChannel) values[this.coldWhiteChannel - 1] = 255;
      if (this.amberChannel) values[this.amberChannel - 1] = 255;
    } else if (this.strobePing) {
      // If we should manually strobe
      values[this.redChannel - 1] = brightnessValue;
      values[this.blueChannel - 1] = brightnessValue;
      values[this.greenChannel - 1] = brightnessValue;
      if (this.warmWhiteChannel) values[this.warmWhiteChannel - 1] = brightnessValue;
      if (this.coldWhiteChannel) values[this.coldWhiteChannel - 1] = brightnessValue;
      if (this.amberChannel) values[this.amberChannel - 1] = brightnessValue;
    } else {
      // If we do not have a shutter channel and the ping is off,
      // turn off all colors
      values[this.redChannel - 1] = 0;
      values[this.blueChannel - 1] = 0;
      values[this.greenChannel - 1] = 0;
      if (this.warmWhiteChannel) values[this.warmWhiteChannel - 1] = 0;
      if (this.coldWhiteChannel) values[this.coldWhiteChannel - 1] = 0;
      if (this.amberChannel) values[this.amberChannel - 1] = 0;
    }

    // If we have no shutter channel, manually flip the strobe bit
    if (!this.shutterChannel) {
      this.strobePing = !this.strobePing;
    }

    return values;
  }

  public setColorsInDmx(
    masterRelativeBrightness: number,
    values: number[],
    shutterOptions: LightsFixtureShutterOptions[],
  ): number[] {
    if (this.masterDimChannel)
      values[this.masterDimChannel - 1] = Math.round(
        this.currentBrightness * masterRelativeBrightness * 255,
      );
    if (this.shutterChannel)
      values[this.shutterChannel - 1] =
        shutterOptions.find((o) => o.shutterOption === ShutterOption.OPEN)?.channelValue ?? 0;
    values[this.redChannel - 1] = this.getColor('redChannel');
    values[this.greenChannel - 1] = this.getColor('greenChannel');
    values[this.blueChannel - 1] = this.getColor('blueChannel');
    if (this.coldWhiteChannel != null) {
      values[this.coldWhiteChannel - 1] = this.getColor('coldWhiteChannel');
    }
    if (this.warmWhiteChannel != null) {
      values[this.warmWhiteChannel - 1] = this.getColor('warmWhiteChannel');
    }
    if (this.amberChannel != null) {
      values[this.amberChannel - 1] = this.getColor('amberChannel');
    }
    if (this.uvChannel != null) {
      values[this.uvChannel - 1] = this.getColor('uvChannel');
    }

    return values;
  }
}
