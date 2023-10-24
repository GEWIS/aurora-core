import { Column, Entity } from 'typeorm';
import LightsFixture, { LightsFixtureCurrentValues } from './lights-fixture';
import Colors from './colors';
import { RgbColorDefinition } from '../../../lights/ColorDefinitions';

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

  setColor(color: RgbColorDefinition) {
    this.setCurrentValues(color);
  }

  setMasterDimmer(masterDimChannel: number) {
    if (this.currentValues.masterDimChannel === masterDimChannel) return;
    this.setCurrentValues({
      masterDimChannel,
    });
  }

  enableStrobe() {
    if (this.currentValues.strobeChannel === 220) return;
    this.setCurrentValues({
      strobeChannel: 220,
    });
  }

  disableStrobe() {
    if (this.currentValues.strobeChannel === 0) return;
    this.setCurrentValues({
      strobeChannel: 0,
    });
  }

  blackout() {
    if (Object.values(this.currentValues).every((v) => v === 0)) return;
    this.setCurrentValues({
      masterDimChannel: 0,
      strobeChannel: 0,
      redChannel: 0,
      greenChannel: 0,
      blueChannel: 0,
      coldWhiteChannel: 0,
      warmWhiteChannel: 0,
      amberChannel: 0,
      uvChannel: 0,
    });
  }

  public get channelValues() {
    return this.currentValues;
  }
}
