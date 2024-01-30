import { Column, Entity } from 'typeorm';
import LightsFixture, { LightsFixtureCurrentValues } from './lights-fixture';
import Colors from './colors';
import { RgbColor, rgbColorDefinitions } from '../color-definitions';

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

  setColor(color: RgbColor) {
    this.setCurrentValues(rgbColorDefinitions[color].definition);
  }

  setMasterDimmer(masterDimChannel: number) {
    if (this.currentValues.masterDimChannel === masterDimChannel) return;
    this.setCurrentValues({
      masterDimChannel,
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

  /**
   * Get the DMX packet for a strobing light (16 channels)
   * @protected
   */
  protected getStrobeDMX(): number[] {
    const values: number[] = new Array(16).fill(0);
    values[this.masterDimChannel - 1] = 255;
    values[this.strobeChannel - 1] = 220;
    values[this.color.redChannel - 1] = 255;
    values[this.color.blueChannel - 1] = 255;
    values[this.color.greenChannel - 1] = 255;
    if (this.color.warmWhiteChannel) values[this.color.warmWhiteChannel - 1] = 255;
    if (this.color.coldWhiteChannel) values[this.color.coldWhiteChannel - 1] = 255;
    if (this.color.amberChannel) values[this.color.amberChannel - 1] = 255;
    return values;
  }

  toDmx(): number[] {
    if (this.strobeEnabled) return this.getStrobeDMX();

    if (this.frozenDmx != null && this.frozenDmx.length > 0) {
      return this.frozenDmx;
    }

    let values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = this.currentValues.masterDimChannel;
    values[this.strobeChannel - 1] = this.channelValues.strobeChannel;
    values[this.color.redChannel - 1] = this.channelValues.redChannel;
    values[this.color.greenChannel - 1] = this.channelValues.greenChannel;
    values[this.color.blueChannel - 1] = this.channelValues.blueChannel;
    if (this.color.coldWhiteChannel != null) {
      values[this.color.coldWhiteChannel - 1] = this.channelValues.coldWhiteChannel || 0;
    }
    if (this.color.warmWhiteChannel != null) {
      values[this.color.warmWhiteChannel - 1] = this.channelValues.warmWhiteChannel || 0;
    }
    if (this.color.amberChannel != null) {
      values[this.color.amberChannel - 1] = this.channelValues.amberChannel || 0;
    }
    if (this.color.uvChannel != null) {
      values[this.color.uvChannel - 1] = this.channelValues.uvChannel || 0;
    }

    values = this.applyDmxOverride(values);

    if (this.shouldReset !== undefined) {
      if ((new Date().getTime() - this.shouldReset.getTime()) > 5000) {
        this.shouldReset = undefined;
      }
      if (this.resetChannelAndValue && this.resetChannelAndValue.length >= 2) {
        const [channel, value] = this.resetChannelAndValue;
        values[channel - 1] = value;
        this.valuesUpdatedAt = new Date();
      }
    }

    if (this.shouldFreezeDmx) {
      this.frozenDmx = values;
    }

    return values;
  }
}
