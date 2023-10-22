import { Column, Entity } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import Colors from './colors';
import Movement from './movement';
import { LightsFixtureCurrentValues } from './lights-fixture';

@Entity()
export default class LightsMovingHeadRgb extends LightsMovingHead {
  @Column(() => Colors)
  public color: Colors;

  public currentValues: Colors & Movement & LightsFixtureCurrentValues = {
    masterDimChannel: 0,
    strobeChannel: 0,
    redChannel: 0,
    greenChannel: 0,
    blueChannel: 0,
    coldWhiteChannel: 0,
    warmWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
    panChannel: 0,
    finePanChannel: 0,
    tiltChannel: 0,
    fineTiltChannel: 0,
    movingSpeedChannel: 0,
  };

  setCurrentValues(values: Partial<Colors & Movement & LightsFixtureCurrentValues>) {
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
