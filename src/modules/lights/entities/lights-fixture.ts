import { AfterLoad, Column } from 'typeorm';
import BaseEntity from '../../root/entities/base-entity';
import { RgbColor } from '../color-definitions';

export interface LightsFixtureCurrentValues extends Pick<LightsFixture, 'masterDimChannel'> {}

export default abstract class LightsFixture extends BaseEntity {
  @Column()
  public name: string;

  @Column({ type: 'tinyint', unsigned: true })
  public masterDimChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public shutterChannel: number;

  @Column({
    type: 'varchar',
    transformer: {
      from(value: string | null): number[] | null {
        if (value == null) return null;
        return JSON.parse(value);
      },
      to(value: number[] | null): string | null {
        if (value == null) return null;
        return JSON.stringify(value);
      },
    },
    nullable: true,
  })
  public resetChannelAndValue?: number[] | null;

  public currentBrightness: number = 1;

  public valuesUpdatedAt: Date;

  private overrideDmx: (number | null)[] = new Array(16).fill(null);

  protected shouldFreezeDmx: boolean;

  protected frozenDmx: number[] | undefined;

  @AfterLoad()
  afterLoad() {
    this.valuesUpdatedAt = new Date();
  }

  protected shouldReset: Date | undefined;

  protected strobeEnabled = false;

  private strobeDisableEvent: NodeJS.Timeout | undefined;

  /**
   * Reset the fixture if possible.
   * @return true if reset command can be sent. False otherwise
   */
  reset(): boolean {
    if (this.resetChannelAndValue == null || this.resetChannelAndValue.length < 2) return false;
    this.shouldReset = new Date();
    return true;
  }

  /**
   * How long the strobe needs to be enabled
   * @param milliseconds
   */
  enableStrobe(milliseconds?: number) {
    this.strobeEnabled = true;
    this.valuesUpdatedAt = new Date();

    // Stop an existing stop strobe timeout if it exists
    if (this.strobeDisableEvent) {
      clearTimeout(this.strobeDisableEvent);
      this.strobeDisableEvent = undefined;
    }

    // Create a stop strobe timeout if a time is given
    if (milliseconds) {
      this.strobeDisableEvent = setTimeout(this.disableStrobe.bind(this), milliseconds);
    }
  }

  /**
   * Disable the strobe if it is enabled
   */
  disableStrobe() {
    this.strobeEnabled = false;
    this.valuesUpdatedAt = new Date();
  }

  public abstract setColor(color: RgbColor): void;
  public abstract resetColor(): void;

  /**
   * Set the relative brightness of the fixture.
   * Should be used by effects.
   * @param brightness Value between [0, 1]
   */
  public setBrightness(brightness: number) {
    // Set upper and lower bounds to 1 and 0 respectively
    this.currentBrightness = Math.max(0, Math.min(1, brightness));
    this.valuesUpdatedAt = new Date();
  }

  /**
   * Override any set relative DMX channels with the given values.
   * Undefined if a channel should not be overriden
   * @param relativeChannels
   */
  public setOverrideDmx(relativeChannels: (number | null)[]) {
    this.overrideDmx = relativeChannels.concat(new Array(16).fill(null)).slice(0, 16);
    this.valuesUpdatedAt = new Date();
  }

  /**
   * Clear any overrides
   */
  public clearOverrideDmx() {
    this.setOverrideDmx([]);
  }

  /**
   * Given an array of length 16 with DMX values, replace any
   * DMX channel value with its override if its not undefined
   * @param dmxValues
   * @protected
   */
  protected applyDmxOverride(dmxValues: number[]): number[] {
    return dmxValues.map((v, i): number => {
      if (this.overrideDmx[i] != null) {
        return this.overrideDmx[i] as number;
      }
      return v;
    });
  }

  /**
   * Apply a blackout to this fixture, i.e. set all channels to zero
   * @protected
   */
  public blackout(): void {
    this.valuesUpdatedAt = new Date();
    this.currentBrightness = 1;
  }

  /**
   * Get the DMX channels that should be used when the fixture should strobe
   * @protected
   */
  protected abstract getStrobeDMX(): number[];

  /**
   * Get the DMX channels that are created from the channel values
   * @protected
   */
  protected abstract getDmxFromCurrentValues(): number[];

  /**
   * Get the current DMX values as an 16-length array of integers.
   */
  toDmx(): number[] {
    if (this.strobeEnabled) return this.getStrobeDMX();

    if (this.frozenDmx != null && this.frozenDmx.length > 0) {
      return this.frozenDmx;
    }

    let values: number[] = this.getDmxFromCurrentValues();
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

  /**
   * Store the next state of the fixture and do not change anymore
   */
  public freezeDmx() {
    this.shouldFreezeDmx = true;
    this.valuesUpdatedAt = new Date();
  }

  /**
   * Unfreeze the DMX values
   */
  public unfreezeDmx() {
    this.shouldFreezeDmx = false;
    this.frozenDmx = [];
    this.valuesUpdatedAt = new Date();
  }
}
