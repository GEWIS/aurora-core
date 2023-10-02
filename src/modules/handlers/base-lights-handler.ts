import LightsController from "../base/entities/lights-controller";

export default abstract class BaseLightsHandler {
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
   * Add a lights controller to this handler
   * @param controller
   */
  public registerLightsController(controller: LightsController): void {
    this.lights.push(controller);
  }

  /**
   * Unregister a controller from this handler
   * @param controller
   */
  public removeLightsController(controller: LightsController): void {
    this.lights = this.lights.filter((c) => c !== controller);
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
