import BaseHandler from './base-handler';
import { LightsGroup } from '../root/entities/lights';

export default abstract class BaseLightsHandler extends BaseHandler<LightsGroup> {
  private bpm: number;

  /**
   * Set the bpm of the current song. Zero (0) if no bpm
   * @param bpm
   */
  public setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  abstract tick(): LightsGroup[];
}
