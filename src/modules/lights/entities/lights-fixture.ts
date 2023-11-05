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
   * Get the current DMX values as an 16-length array of integers.
   */
  abstract toDmx(): number[];
}
