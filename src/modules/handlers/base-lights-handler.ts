import LightsController from "../base/entities/lights-controller";
import BaseHandler from "./base-handler";
import {LightsGroup} from "../base/entities/lights";

export default abstract class BaseLightsHandler extends BaseHandler<LightsGroup> {
  private bpm: number;

  private lights: LightsController[] = [];

  /**
   * Set the bpm of the current song. Zero (0) if no bpm
   * @param bpm
   */
  public setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  /**
   * Handle a beat of the current playing song
   * @param timestamp timestamp of the current beat
   */
  public abstract beat(timestamp: number): void

  /**
   * Handle a tick to recalculate the current light settings.
   * Runs more frequent than beat (at least 44Hz)
   * @param timestamp
   */
  public abstract tick(timestamp: number): void
}
