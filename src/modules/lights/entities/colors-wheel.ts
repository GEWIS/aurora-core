import { Column, OneToMany } from 'typeorm';
import LightsMovingHeadWheelShutterOptions from './lights-moving-head-wheel-shutter-options';
import LightsWheelColorChannelValue from './lights-wheel-color-channel-value';
import LightsWheelGoboChannelValue from './lights-wheel-gobo-channel-value';
import LightsWheelRotateChannelValue from './lights-wheel-rotate-channel-value';
import { RgbColor, rgbColorDefinitions, WheelColor } from '../color-definitions';
import Colors from './colors';
import LightsFixtureShutterOptions, { ShutterOption } from './lights-fixture-shutter-options';

export interface IColorsWheel {
  colorChannel: number;
  goboChannel: number;
  goboRotateChannel?: number | null;
}

export default class ColorsWheel extends Colors implements IColorsWheel {
  @Column({ type: 'tinyint', unsigned: true })
  public masterDimChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public shutterChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public colorChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public goboChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public goboRotateChannel: number | null;

  @OneToMany(() => LightsWheelColorChannelValue, (c) => c.movingHead, { eager: true })
  public colorChannelValues: LightsWheelColorChannelValue[];

  @OneToMany(() => LightsWheelGoboChannelValue, (c) => c.movingHead, { eager: true })
  public goboChannelValues: LightsWheelGoboChannelValue[];

  @OneToMany(() => LightsWheelRotateChannelValue, (c) => c.movingHead, { eager: true })
  public goboRotateChannelValues: LightsWheelRotateChannelValue[];

  private currentValues: IColorsWheel = {
    colorChannel: 0,
    goboChannel: 0,
    goboRotateChannel: 0,
  };

  public setColor(color: RgbColor): void {
    const wheelColor = rgbColorDefinitions[color].alternative;
    const channelValueObj = this.colorChannelValues.find((v) => v.name === wheelColor);
    this.currentValues = {
      ...this.currentValues,
      colorChannel: channelValueObj?.value ?? 0,
    };
  }

  public setGobo(gobo?: string) {
    const channelValueObj = this.goboChannelValues.find((v) => v.name === gobo);
    this.currentValues = {
      ...this.currentValues,
      goboChannel: channelValueObj?.value ?? 0,
    };
  }

  public setGoboRotate(rotate?: string) {
    const channelValueObj = this.goboRotateChannelValues.find((v) => v.name === rotate);
    this.currentValues = {
      ...this.currentValues,
      goboRotateChannel: channelValueObj?.value ?? 0,
    };
  }

  public reset(): void {
    this.currentValues = {
      colorChannel: 0,
      goboChannel: 0,
      goboRotateChannel: 0,
    };
  }

  private get channelValues() {
    return this.currentValues;
  }

  public setStrobeInDmx(values: number[], shutterOptions: LightsFixtureShutterOptions[]): number[] {
    values[this.masterDimChannel - 1] = 255;
    values[this.shutterChannel - 1] =
      shutterOptions.find((o) => o.shutterOption === ShutterOption.STROBE)?.channelValue ?? 0;
    values[this.colorChannel - 1] =
      this.colorChannelValues.find((o) => o.name === WheelColor.WHITE)?.value ?? 0;

    return values;
  }

  public setColorsInDmx(values: number[], shutterOptions: LightsFixtureShutterOptions[]): number[] {
    values[this.masterDimChannel - 1] = Math.round(this.currentBrightness * 255);
    values[this.shutterChannel - 1] =
      shutterOptions.find((o) => o.shutterOption === ShutterOption.OPEN)?.channelValue ?? 0;
    values[this.colorChannel - 1] = this.channelValues.colorChannel;
    values[this.goboChannel - 1] = this.channelValues.goboChannel;
    if (this.goboRotateChannel != null) {
      values[this.goboRotateChannel - 1] = this.channelValues.goboRotateChannel || 0;
    }

    return values;
  }
}
