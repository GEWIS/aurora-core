import { Column, Entity } from 'typeorm';
import LightsFixture, { LightsFixtureCurrentValues } from './lights-fixture';
import Colors from './colors';

@Entity()
export default class LightsPar extends LightsFixture {
  @Column(() => Colors)
  public color: Colors;

  private currentValues: Required<Colors & LightsFixtureCurrentValues> = {
    masterDimChannel: 0,
    strobeChannel: 0,
    redChannel: 0,
    greenChannel: 0,
    blueChannel: 0,
    coldWhiteChannel: 0,
    warmWhiteChannel: 0,
    amberChannel: 0,
    uvChannel: 0,
  };

  setCurrentValues(values: Partial<Colors & LightsFixtureCurrentValues>) {
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
