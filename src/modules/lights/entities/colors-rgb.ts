import { Column } from 'typeorm';
import { RgbColor, rgbColorDefinitions } from '../color-definitions';

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

export default class ColorsRgb implements IColorsRgb {
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

  private currentValues: IColorsRgb = {
    redChannel: 0,
    greenChannel: 0,
    blueChannel: 0,
    coldWhiteChannel: 0,
    warmWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  };

  public setColor(color: RgbColor): void {
    this.currentValues = rgbColorDefinitions[color].definition;
  }

  public setCustomColor(color: IColorsRgb): void {
    this.currentValues = color;
  }

  public reset(): void {
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

  private get channelValues() {
    return this.currentValues;
  }

  public setColorsInDmx(values: number[]): number[] {
    values[this.redChannel - 1] = this.channelValues.redChannel;
    values[this.greenChannel - 1] = this.channelValues.greenChannel;
    values[this.blueChannel - 1] = this.channelValues.blueChannel;
    if (this.coldWhiteChannel != null) {
      values[this.coldWhiteChannel - 1] = this.channelValues.coldWhiteChannel || 0;
    }
    if (this.warmWhiteChannel != null) {
      values[this.warmWhiteChannel - 1] = this.channelValues.warmWhiteChannel || 0;
    }
    if (this.amberChannel != null) {
      values[this.amberChannel - 1] = this.channelValues.amberChannel || 0;
    }
    if (this.uvChannel != null) {
      values[this.uvChannel - 1] = this.channelValues.uvChannel || 0;
    }

    return values;
  }
}
