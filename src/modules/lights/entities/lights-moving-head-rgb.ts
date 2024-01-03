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
      panChannel: 0,
      finePanChannel: 0,
      tiltChannel: 0,
      fineTiltChannel: 0,
      movingSpeedChannel: 0,
    });
  }

  public get channelValues() {
    return this.currentValues;
  }

  /**
   * Get the DMX packet for a strobing light
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
    let values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = this.channelValues.masterDimChannel;
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
    values[this.movement.panChannel - 1] = this.channelValues.panChannel;
    if (this.movement.finePanChannel != null) {
      values[this.movement.finePanChannel] = this.channelValues.finePanChannel || 0;
    }
    values[this.movement.tiltChannel - 1] = this.channelValues.tiltChannel;
    if (this.movement.fineTiltChannel != null) {
      values[this.movement.fineTiltChannel - 1] = this.channelValues.fineTiltChannel || 0;
    }
    if (this.movement.movingSpeedChannel != null) {
      values[this.movement.movingSpeedChannel - 1] = this.channelValues.movingSpeedChannel || 0;
    }

    // If the strobe is enabled, override all color channels with a strobe
    if (this.strobeEnabled) {
      const strobeDmxValues = this.getStrobeDMX();

      // Remove starting zeroes, so we don't override the position of the moving head.
      // Assumes that all color-related channels are near each other;
      let nrStartingZeroes = 0;
      while (strobeDmxValues.length > 0) {
        if (strobeDmxValues[0] === 0) {
          strobeDmxValues.shift();
          nrStartingZeroes += 1;
        } else {
          break;
        }
      }
      values.splice(
        nrStartingZeroes,
        nrStartingZeroes + strobeDmxValues.length,
        ...strobeDmxValues,
      );
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

    return values;
  }
}
