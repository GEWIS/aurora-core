import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import { RgbColor, WheelColor } from '../color-definitions';
import LightsMovingHeadWheelShutterOptions from './lights-moving-head-wheel-shutter-options';
import { ShutterOption } from './lights-fixture-shutter-options';
import ColorsWheel from './colors-wheel';

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @OneToMany(() => LightsMovingHeadWheelShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsMovingHeadWheelShutterOptions[];

  @Column(() => ColorsWheel)
  public wheel: ColorsWheel;

  public setColor(color: RgbColor) {
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

  /**
   * Get the DMX packet for a strobing light
   * @protected
   */
  protected getStrobeDMX(): number[] {
    let values: number[] = new Array(16).fill(0);
    values[this.masterDimChannel - 1] = 255;
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.STROBE)?.channelValue ?? 0;
    values[this.wheel.colorChannel - 1] =
      this.wheel.colorChannelValues.find((o) => o.name === WheelColor.WHITE)?.value ?? 0;

    values = this.setPositionInDmx(values);

    return values;
  }

  public getDmxFromCurrentValues(): number[] {
    let values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = Math.round(this.currentBrightness * 255);
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.OPEN)?.channelValue ?? 0;

    values = this.wheel.setColorsInDmx(values);
    values = this.setPositionInDmx(values);

    return values;
  }
}
