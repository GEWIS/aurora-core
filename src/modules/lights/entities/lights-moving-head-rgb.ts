import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import ColorsRgb, { IColorsRgb } from './colors-rgb';
import { RgbColor } from '../color-definitions';
// eslint-disable-next-line import/no-cycle
import LightsMovingHeadRgbShutterOptions from './lights-moving-head-rgb-shutter-options';
import { ShutterOption } from './lights-fixture-shutter-options';

@Entity()
export default class LightsMovingHeadRgb extends LightsMovingHead {
  @OneToMany(() => LightsMovingHeadRgbShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsMovingHeadRgbShutterOptions[];

  @Column(() => ColorsRgb)
  public color: ColorsRgb;

  public setColor(color: RgbColor) {
    this.valuesUpdatedAt = new Date();
    this.color.setColor(color);
  }

  public setCustomColor(color: IColorsRgb) {
    this.valuesUpdatedAt = new Date();
    this.color.setCustomColor(color);
  }

  public resetColor() {
    this.valuesUpdatedAt = new Date();
    this.color.reset();
  }

  public blackout() {
    super.blackout();
    this.color.reset();
  }

  /**
   * Get the DMX packet for a strobing light
   * @protected
   */
  protected getStrobeDMX(): number[] {
    let values: number[] = new Array(16).fill(0);
    values[this.masterDimChannel - 1] = 255;
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.STROBE)?.channelValue ?? 0;
    values[this.color.redChannel - 1] = 255;
    values[this.color.blueChannel - 1] = 255;
    values[this.color.greenChannel - 1] = 255;
    if (this.color.warmWhiteChannel) values[this.color.warmWhiteChannel - 1] = 255;
    if (this.color.coldWhiteChannel) values[this.color.coldWhiteChannel - 1] = 255;
    if (this.color.amberChannel) values[this.color.amberChannel - 1] = 255;

    values = this.setPositionInDmx(values);

    return values;
  }

  public getDmxFromCurrentValues(): number[] {
    let values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = Math.round(this.currentBrightness * 255);
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.OPEN)?.channelValue ?? 0;

    values = this.color.setColorsInDmx(values);
    values = this.setPositionInDmx(values);

    return values;
  }
}
