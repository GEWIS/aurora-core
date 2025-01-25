import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import ColorsRgb, { IColorsRgb } from './colors-rgb';
import { RgbColor } from '../color-definitions';
// eslint-disable-next-line import/no-cycle
import LightsMovingHeadRgbShutterOptions from './lights-moving-head-rgb-shutter-options';

@Entity()
export default class LightsMovingHeadRgb extends LightsMovingHead {
  @OneToMany(() => LightsMovingHeadRgbShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsMovingHeadRgbShutterOptions[];

  @Column(() => ColorsRgb)
  public color: ColorsRgb;

  public get masterDimChannel(): number {
    return this.color.masterDimChannel;
  }

  public get shutterChannel(): number {
    return this.color.shutterChannel;
  }

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

  public disableStrobe(): void {
    this.valuesUpdatedAt = new Date();
    this.color.disableStrobe();
  }

  public enableStrobe(milliseconds?: number): void {
    this.valuesUpdatedAt = new Date();
    this.color.disableStrobe();
  }

  public setBrightness(brightness: number): void {
    this.valuesUpdatedAt = new Date();
    this.color.setBrightness(brightness);
  }

  protected strobeEnabled(): boolean {
    return this.color.strobeEnabled();
  }

  /**
   * Get the DMX packet for a strobing light
   * @protected
   */
  protected getStrobeDMX(): number[] {
    let values: number[] = new Array(16).fill(0);

    values = this.color.setStrobeInDmx(values, this.shutterOptions);
    values = this.setPositionInDmx(values);

    return values;
  }

  public getDmxFromCurrentValues(): number[] {
    let values: number[] = new Array(16).fill(0);

    values = this.color.setColorsInDmx(values, this.shutterOptions);
    values = this.setPositionInDmx(values);

    return values;
  }
}
