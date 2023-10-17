import { Namespace } from 'socket.io';
import BaseHandler from './base-handler';
import { LightsGroup } from '../root/entities/lights';
import { BeatEmitter } from '../events';

export default abstract class BaseLightsHandler extends BaseHandler<LightsGroup> {
  private bpm: number;

  private lights: LightsGroup[] = [];

  protected websocket: Namespace;

  protected beatEmitter: BeatEmitter;

  protected constructor(socket: Namespace, beatEmitter: BeatEmitter) {
    super();
    this.websocket = socket;
    this.beatEmitter = beatEmitter;

    this.beatEmitter.on('bpm', (...args) => this.setBpm(args[0]));
  }

  /**
   * Set the bpm of the current song. Zero (0) if no bpm
   * @param bpm
   */
  public setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  protected sendDataToController(data: any) {
    this.websocket.emit('dmx_packet', data);
  }
}
