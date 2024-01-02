import { AfterLoad, Column } from 'typeorm';
import BaseEntity from '../../root/entities/base-entity';

export interface LightsFixtureCurrentValues {
  masterDimChannel: number,
  strobeChannel: number,
}

export default abstract class LightsFixture extends BaseEntity {
  @Column()
  public name: string;

  @Column({ type: 'tinyint', unsigned: true })
  public masterDimChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public strobeChannel: number;

  public valuesUpdatedAt: Date;

  private overrideDmx: (number | null)[] = new Array(16).fill(null);

  @AfterLoad()
  afterLoad() {
    this.valuesUpdatedAt = new Date();
  }

  protected strobeEnabled = false;

  private strobeDisableEvent: NodeJS.Timeout | undefined;

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

  /**
   * Override any set relative DMX channels with the given values.
   * Undefined if a channel should not be overriden
   * @param relativeChannels
   */
  public setOverrideDmx(relativeChannels: (number | null)[]) {
    this.overrideDmx = relativeChannels.concat(new Array(16).fill(null)).slice(0, 16);
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
   * Get the current DMX values as an 16-length array of integers.
   */
  abstract toDmx(): number[];
}
