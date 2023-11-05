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

  /**
   * How long the strobe needs to be enabled
   * @param milliseconds
   */
  enableStrobe(milliseconds?: number) {
    this.strobeEnabled = true;
    if (milliseconds) {
      setTimeout(this.disableStrobe.bind(this), milliseconds);
    }
  }

  /**
   * Disable the strobe if it is enabled
   */
  disableStrobe() {
    this.strobeEnabled = false;
  }

  protected removeEndingZeroes(input: number[]): number[] {
    const result = [...input];
    while (result.length > 0) {
      if (result[result.length - 1] === 0) {
        result.pop();
      } else {
        break;
      }
    }
    return result;
  }

  /**
   * Get the current DMX values as an array of integers.
   * The length of the resulting array depends on how many channels are non-zero
   */
  abstract toDmx(): number[];
}
