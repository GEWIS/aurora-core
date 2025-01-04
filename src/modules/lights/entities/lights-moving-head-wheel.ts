import { Column, Entity, OneToMany } from 'typeorm';
import LightsMovingHead from './lights-moving-head';
import Movement from './movement';
import { LightsFixtureCurrentValues } from './lights-fixture';
import { RgbColor, rgbColorDefinitions, WheelColor } from '../color-definitions';
// eslint-disable-next-line import/no-cycle
import LightsMovingHeadWheelShutterOptions from './lights-moving-head-wheel-shutter-options';
import { ShutterOption } from './lights-fixture-shutter-options';
// eslint-disable-next-line import/no-cycle
import LightsWheelColorChannelValue from './lights-wheel-color-channel-value';
import LightsWheelGoboChannelValue from './lights-wheel-gobo-channel-value';
import LightsWheelRotateChannelValue from './lights-wheel-rotate-channel-value';

interface LightsMovingHeadWheelCurrentValues extends Movement, LightsFixtureCurrentValues {
  colorWheelChannel: number;
  goboWheelChannel: number;
  goboRotateChannel?: number;
}

@Entity()
export default class LightsMovingHeadWheel extends LightsMovingHead {
  @OneToMany(() => LightsMovingHeadWheelShutterOptions, (opt) => opt.fixture, { eager: true })
  public shutterOptions: LightsMovingHeadWheelShutterOptions[];

  @Column({ type: 'tinyint', unsigned: true })
  public colorWheelChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public goboWheelChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public goboRotateChannel: number | null;

  @OneToMany(() => LightsWheelColorChannelValue, (c) => c.movingHead, { eager: true })
  public colorWheelChannelValues: LightsWheelColorChannelValue[];

  @OneToMany(() => LightsWheelGoboChannelValue, (c) => c.movingHead, { eager: true })
  public goboWheelChannelValues: LightsWheelGoboChannelValue[];

  @OneToMany(() => LightsWheelRotateChannelValue, (c) => c.movingHead, { eager: true })
  public goboRotateChannelValues: LightsWheelRotateChannelValue[];

  private currentValues: LightsMovingHeadWheelCurrentValues = {
    masterDimChannel: 0,
    panChannel: 0,
    finePanChannel: 0,
    tiltChannel: 0,
    fineTiltChannel: 0,
    movingSpeedChannel: 0,
    colorWheelChannel: 0,
    goboWheelChannel: 0,
    goboRotateChannel: 0,
  };

  setColor(color: RgbColor) {
    const wheelColor = rgbColorDefinitions[color].alternative;
    const channelValueObj = this.colorWheelChannelValues.find((v) => v.name === wheelColor);
    this.setCurrentValues({
      colorWheelChannel: channelValueObj?.value ?? 0,
    });
  }

  setGobo(gobo?: string) {
    const channelValueObj = this.goboWheelChannelValues.find((v) => v.name === gobo);
    this.setCurrentValues({
      goboWheelChannel: channelValueObj?.value ?? 0,
    });
  }

  setGoboRotate(rotate?: string) {
    const channelValueObj = this.goboRotateChannelValues.find((v) => v.name === rotate);
    this.setCurrentValues({
      goboRotateChannel: channelValueObj?.value ?? 0,
    });
  }

  /**
   * @param pan value between [0, 255). Any decimals are applied to the finePan
   * @param tilt value between [0, 255). Any decimals are applied to the finePan
   */
  setPosition(pan: number, tilt: number) {
    const panChannel = Math.floor(pan);
    const tiltChannel = Math.floor(tilt);
    const finePanChannel = Math.floor((pan - panChannel) * 255);
    const fineTiltChannel = Math.floor((tilt - tiltChannel) * 255);

    this.setCurrentValues({
      panChannel,
      finePanChannel,
      tiltChannel,
      fineTiltChannel,
    });
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

  /**
   * Get the DMX packet for a strobing light
   * @protected
   */
  protected getStrobeDMX(): number[] {
    const values: number[] = new Array(16).fill(0);
    values[this.masterDimChannel - 1] = 255;
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.STROBE)?.channelValue ?? 0;
    values[this.colorWheelChannel - 1] =
      this.colorWheelChannelValues.find((o) => o.name === WheelColor.WHITE)?.value ?? 0;
    return values;
  }

  toDmx(): number[] {
    if (this.frozenDmx != null && this.frozenDmx.length > 0) {
      return this.frozenDmx;
    }

    let values: number[] = new Array(16).fill(0);

    values[this.masterDimChannel - 1] = this.channelValues.masterDimChannel;
    values[this.shutterChannel - 1] =
      this.shutterOptions.find((o) => o.shutterOption === ShutterOption.OPEN)?.channelValue ?? 0;
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
      if (new Date().getTime() - this.shouldReset.getTime() > 5000) {
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
