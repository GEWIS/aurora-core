import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import Movement from './movement';
import { LightsFixtureCurrentValues } from './lights-fixture';
import LightsWheelChannelValue, { ColorWheelColors } from './lights-wheel-channel-value';

interface LightsMovingHeadWheelCurrentValues extends Movement, LightsFixtureCurrentValues {
  colorWheelChannel: number,
  goboWheelChannel: number,
  goboRotateChannel?: number,
}

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @Column({ type: 'tinyint', unsigned: true })
  public colorWheelChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public goboWheelChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public goboRotateChannel: number | null;

  @OneToMany(() => LightsWheelChannelValue, (c) => c.movingHead, { eager: true })
  public colorWheelChannelValues: LightsWheelChannelValue<ColorWheelColors>[];

  @OneToMany(() => LightsWheelChannelValue, (c) => c.movingHead, { eager: true })
  public goboWheelChannelValues: LightsWheelChannelValue<string>[];

  private currentValues: LightsMovingHeadWheelCurrentValues = {
    masterDimChannel: 0,
    strobeChannel: 0,
    panChannel: 0,
    finePanChannel: 0,
    tiltChannel: 0,
    fineTiltChannel: 0,
    movingSpeedChannel: 0,
    colorWheelChannel: 0,
    goboWheelChannel: 0,
    goboRotateChannel: 0,
  };

  setCurrentValues(values: Partial<LightsMovingHeadWheelCurrentValues>) {
    this.currentValues = {
      ...this.currentValues,
      ...values,
    };
    this.valuesUpdatedAt = new Date();
  }

  public get channelValues() {
    return this.currentValues;
  }
}
