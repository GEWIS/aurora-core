import { MusicEmitter } from '../events';
import { BeatEvent } from '../events/music-emitter-events';

export interface ArtificialBeatGeneratorParams {
  /**
   * Beats per minute
   * @minimum 1 Should be positive and not null
   */
  bpm: number;
}

export class ArtificialBeatGenerator {
  private beatStart: Date | undefined;

  public bpm: number | undefined;

  private beatInterval: number;

  private interval: NodeJS.Timeout;

  private musicEmitter: MusicEmitter;

  private static instance: ArtificialBeatGenerator;

  private ping = false;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ArtificialBeatGenerator();
    }
    return this.instance;
  }

  public init(musicEmitter: MusicEmitter) {
    if (this.musicEmitter) {
      throw new Error('ArtificalBeatGenerator already initialized');
    }
    this.musicEmitter = musicEmitter;
  }

  /**
   * Whether the generator is generating and transmitting beats
   */
  get active() {
    return this.beatStart !== undefined;
  }

  /**
   * Start the beat generator with the given BPM (beats per minute)
   * @param bpm
   */
  start(bpm: number) {
    if (this.beatStart) this.stop();

    this.bpm = bpm;
    this.beatInterval = Math.round(60000 / bpm);

    this.beatStart = new Date();
    this.musicEmitter.artificialBeatGeneratorEnabled = true;
    this.interval = setInterval(this.emitBeat.bind(this), this.beatInterval);
    this.emitBeat();
  }

  /**
   * Stop the beat generator
   */
  stop() {
    clearInterval(this.interval);
    this.bpm = undefined;
    this.beatStart = undefined;
    this.musicEmitter.artificialBeatGeneratorEnabled = false;
  }

  /**
   * Emit a beat to the music emitter. Confidence is always 0.5 because it's an artifical beat
   * @private
   */
  private emitBeat() {
    if (!this.beatStart) return;

    const event: BeatEvent = {
      beat: {
        start: (new Date().getTime() - this.beatStart.getTime()) / 1000,
        duration: this.beatInterval,
        confidence: 0.5,
      },
    };

    if (process.env.LOG_AUDIO_BEATS === 'true') {
      let beat = '';

      if (this.ping) beat += 'beat:   . ';
      if (!this.ping) beat += 'beat:  .  ';
      this.ping = !this.ping;

      beat += `: ${event.beat.start} (artificial)`;
      // eslint-disable-next-line no-console
      console.log(beat);
    }

    this.musicEmitter.emitAudio('beat', event);
  }
}
