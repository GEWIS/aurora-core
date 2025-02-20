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

  public setColor(color?: RgbColor) {
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

  public enableStrobe(milliseconds?: number): void {
    this.valuesUpdatedAt = new Date();
    this.color.enableStrobe(milliseconds);
  }

  public disableStrobe(): void {
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
  protected getStrobeDMX(masterRelativeBrightness: number): number[] {
    let values = this.getEmptyDmxSubPacket();
    values = this.color.setStrobeInDmx(masterRelativeBrightness, values, this.shutterOptions);

    if (!this.color.shutterChannel) {
      // The getStrobeInDmx() value changes its state if we need to
      // strobe manually. Because of optimizations, we need to also
      // indicate the state has changed.
      this.valuesUpdatedAt = new Date(new Date().getTime() + 1000);
    }

    return values;
  }

  public getDmxFromCurrentValues(masterRelativeBrightness: number): number[] {
    let values = this.getEmptyDmxSubPacket();

    values = this.color.setColorsInDmx(masterRelativeBrightness, values, this.shutterOptions);

    return values;
  }
}
