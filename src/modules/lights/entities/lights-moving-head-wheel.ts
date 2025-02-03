import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import { RgbColor } from '../color-definitions';
import LightsMovingHeadWheelShutterOptions from './lights-moving-head-wheel-shutter-options';
import ColorsWheel from './colors-wheel';

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @OneToMany(() => LightsMovingHeadWheelShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsMovingHeadWheelShutterOptions[];

  @Column(() => ColorsWheel)
  public wheel: ColorsWheel;

  public setColor(color?: RgbColor) {
    this.valuesUpdatedAt = new Date();
    this.wheel.setColor(color);
  }

  public resetColor(): void {
    this.valuesUpdatedAt = new Date();
    this.wheel.reset();
  }

  public setGobo(gobo?: string) {
    this.valuesUpdatedAt = new Date();
    this.wheel.setGobo(gobo);
  }

  public setGoboRotate(rotate?: string) {
    this.valuesUpdatedAt = new Date();
    this.wheel.setGoboRotate(rotate);
  }

  public blackout() {
    super.blackout();
    this.wheel.reset();
  }

  public enableStrobe(milliseconds?: number): void {
    this.valuesUpdatedAt = new Date();
    this.wheel.enableStrobe(milliseconds);
  }

  public disableStrobe(): void {
    this.valuesUpdatedAt = new Date();
    this.wheel.disableStrobe();
  }

  public setBrightness(brightness: number): void {
    this.valuesUpdatedAt = new Date();
    this.wheel.setBrightness(brightness);
  }

  protected strobeEnabled(): boolean {
    return this.wheel.strobeEnabled();
  }

  /**
   * Get the DMX packet for a strobing light
   * @protected
   */
  protected getStrobeDMX(): number[] {
    let values = this.getEmptyDmxSubPacket();

    values = this.wheel.setStrobeInDmx(values, this.shutterOptions);
    values = this.setPositionInDmx(values);

    if (!this.wheel.shutterChannel) {
      // The getStrobeInDmx() value changes its state if we need to
      // strobe manually. Because of optimizations, we need to also
      // indicate the state has changed.
      this.valuesUpdatedAt = new Date(new Date().getTime() + 1000);
    }

    return values;
  }

  public getDmxFromCurrentValues(): number[] {
    let values = this.getEmptyDmxSubPacket();

    values = this.wheel.setColorsInDmx(values, this.shutterOptions);
    values = this.setPositionInDmx(values);

    return values;
  }
}
