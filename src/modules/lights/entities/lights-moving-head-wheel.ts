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

  blackout() {
    if (Object.values(this.currentValues).every((v) => v === 0)) return;
    this.setCurrentValues({
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
    });
  }

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

  toDmx(): number[] {
    const values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = this.channelValues.masterDimChannel;
    values[this.strobeChannel - 1] = this.channelValues.masterDimChannel;
    values[this.movement.panChannel - 1] = this.channelValues.panChannel;
    values[this.colorWheelChannel - 1] = this.channelValues.colorWheelChannel;
    values[this.goboWheelChannel - 1] = this.channelValues.goboWheelChannel;
    if (this.goboRotateChannel != null) {
      values[this.goboRotateChannel - 1] = this.channelValues.goboRotateChannel || 0;
    }
    if (this.movement.finePanChannel != null) {
      values[this.movement.finePanChannel - 1] = this.channelValues.finePanChannel || 0;
    }
    values[this.movement.tiltChannel - 1] = this.channelValues.tiltChannel;
    if (this.movement.fineTiltChannel != null) {
      values[this.movement.fineTiltChannel - 1] = this.channelValues.fineTiltChannel || 0;
    }
    if (this.movement.movingSpeedChannel != null) {
      values[this.movement.movingSpeedChannel - 1] = this.channelValues.movingSpeedChannel || 0;
    }

    if (this.strobeEnabled) {
      values[this.colorWheelChannel - 1] = 0;
      values[this.goboWheelChannel - 1] = 0;
      if (this.goboRotateChannel != null) values[this.goboRotateChannel - 1] = 0;
      values[this.masterDimChannel - 1] = 255;
      values[this.strobeChannel - 1] = 220;
    }

    return values;
  }
}
