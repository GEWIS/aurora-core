import { Namespace } from 'socket.io';
import BaseAudioHandler from '../base-audio-handler';

export default class SimpleAudioHandler extends BaseAudioHandler {
  private socket: Namespace;

  private nrLoaded = 0;

  constructor(socket: Namespace) {
    super();
    this.socket = socket;

    this.socket.on('load_audio_success', this.audioFileLoaded.bind(this));
  }

  public load(url: string) {
    this.nrLoaded = 0;
    this.socket.emit('load_audio', url);
  }

  private audioFileLoaded() {
    this.nrLoaded += 1;
  }

  public play() {
    if (!this.ready) throw new Error('Not all audio players are ready!');
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

  public get ready() {
    return true;

    // TODO: fix incoming messages about tracks being loaded, not getting received
    // return this.nrLoaded === this.entities.length;
  }
}
