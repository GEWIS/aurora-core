import { Namespace } from 'socket.io';
import BaseAudioHandler from '../base-audio-handler';

export default class SimpleAudioHandler extends BaseAudioHandler {
  private socket: Namespace;

  constructor(socket: Namespace) {
    super();
    this.socket = socket;
  }

  public play() {
    this.socket.emit('play_audio');
  }

  public stop() {
    this.socket.emit('stop_audio');
  }

  /**
   * Set playback to a certain point in time (fast-forward or revert)
   */
  public setPlayback(seconds: number) {
    this.socket.emit('skip_to', seconds);
  }
}
