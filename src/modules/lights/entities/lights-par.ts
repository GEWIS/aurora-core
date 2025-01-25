import { Column, Entity, OneToMany } from 'typeorm';
import LightsFixture from './lights-fixture';
import ColorsRgb, { IColorsRgb } from './colors-rgb';
import { RgbColor } from '../color-definitions';
// eslint-disable-next-line import/no-cycle
import LightsParShutterOptions from './lights-par-shutter-options';

@Entity()
export default class LightsPar extends LightsFixture {
  @OneToMany(() => LightsParShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsParShutterOptions[];

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
   * Get the DMX packet for a strobing light (16 channels)
   * @protected
   */
  protected getStrobeDMX(): number[] {
    const values: number[] = new Array(16).fill(0);
    return this.color.setStrobeInDmx(values, this.shutterOptions);
  }

  public getDmxFromCurrentValues(): number[] {
    let values: number[] = new Array(16).fill(0);

    values = this.color.setColorsInDmx(values, this.shutterOptions);

    return values;
  }
}
