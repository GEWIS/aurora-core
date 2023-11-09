import { Namespace } from 'socket.io';
import BaseAudioHandler from '../base-audio-handler';

export default class SimpleAudioHandler extends BaseAudioHandler {
  private socket: Namespace;

  private nrLoaded = 0;

  private onStartedPlayingHandlers: ((startTime: number) => void)[] = [];

  constructor(socket: Namespace) {
    super();
    this.socket = socket;

    this.socket.on('connection', (sc) => {
      sc.on('load_audio_success', this.audioFileLoaded.bind(this));
      sc.on('play_audio_started', (startTime: number) => {
        console.log('handle play audio started events', startTime);
        this.onStartedPlayingHandlers.forEach((h) => h(startTime));
        this.onStartedPlayingHandlers = [];
      });
    });
  }

  public load(url: string) {
    this.nrLoaded = 0;
    this.socket.emit('load_audio', url);
  }

  private audioFileLoaded() {
    console.log('Audio file loaded');
    this.nrLoaded += 1;
  }

  /**
   * Start playing audio. Optionally provide a callback function that is called
   * once the listener starts playing audio. It will then provide the time in ms
   * since epoch at which audio started playing (listener machine time)
   * @param onPlaying
   */
  public play(onPlaying?: (startTime: number) => void) {
    if (!this.ready) throw new Error('Not all audio players are ready!');

    if (onPlaying) {
      this.onStartedPlayingHandlers.push(onPlaying);
    }

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
