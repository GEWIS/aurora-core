import {
  AudioAnalysis, AudioFeatures, Beat, PlaybackState, Section, Segment, Tatum,
} from '@spotify/web-api-ts-sdk';
import SpotifyApiHandler from './spotify-api-handler';
import { MusicEmitter } from '../events';

interface BeatEvent {
  beat: Beat;
  segment?: Segment;
  section?: Section;
  tatum?: Tatum;
}

export default class SpotifyTrackHandler {
  private static instance: SpotifyTrackHandler;

  private initialized = false;

  private syncLoopTimer;

  private readonly api: SpotifyApiHandler;

  private playState: PlaybackState;

  private currentlyPlayingFeatures: AudioFeatures;

  private currentlyPlayingAnalysis: AudioAnalysis;

  private beatEvents: {
    event: BeatEvent,
    timeout: NodeJS.Timeout
  }[];

  private beatEmitter: MusicEmitter;

  private ping = false;

  private constructor() {
    this.api = SpotifyApiHandler.getInstance();
    this.syncLoopTimer = setInterval(this.syncLoop.bind(this), 5000);
    this.syncLoop().then(() => {});
    this.beatEvents = [];
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SpotifyTrackHandler();
    }
    return this.instance;
  }

  public async init(emitter: MusicEmitter) {
    if (this.initialized) throw new Error('SpotifyTrackHandler is already initialized!');
    this.beatEmitter = emitter;
    this.initialized = true;
  }

  /**
   * Stop the beat events and delete them
   * @private
   */
  private stopBeatEvents() {
    this.beatEvents.forEach((e) => {
      clearTimeout(e.timeout);
    });
    this.beatEvents = [];
  }

  private setBeatEvents(track: AudioAnalysis) {
    this.stopBeatEvents();

    const progress = this.playState.progress_ms;

    this.beatEvents = track.beats
      .filter((b) => (b.start * 1000 >= progress))
      .map((beat) => {
        const segment = track.segments
          .find((s) => s.start <= beat.start && (s.start + s.duration) >= beat.start);
        const section = track.sections
          .find((s) => s.start <= beat.start && (s.start + s.duration) >= beat.start);
        const tatum = track.tatums
          .find((s) => s.start <= beat.start && (s.start + s.duration) >= beat.start);

        const beatEvent = {
          beat,
          segment,
          section,
          tatum,
        };
        const timeout = setTimeout(
          this.syncBeat.bind(this, beatEvent),
          (beat.start * 1000) - progress,
        );
        return {
          event: beatEvent,
          timeout,
        };
      });
  }

  /**
   * Main event loop to get the currently playing song
   * @private
   */
  private async syncLoop() {
    console.log('Start Spotify sync job');
    if (!this.api.client) return;

    const state = await this.api.client.player.getCurrentlyPlayingTrack();

    if (state.currently_playing_type === 'track' && (!this.playState || this.playState.item?.id !== state.item?.id)) {
      this.currentlyPlayingFeatures = await this.api.client.tracks
        .audioFeatures(state.item.id);
      this.currentlyPlayingAnalysis = await this.api.client.tracks
        .audioAnalysis(state.item.id);

      console.log(this.currentlyPlayingFeatures);
    }

    if (!state.is_playing && this.playState.is_playing) {
      this.stopBeatEvents();
    }

    this.playState = state;

    this.setBeatEvents(this.currentlyPlayingAnalysis);
  }

  /**
   * Event loop that is called at every beat of the currently playing track
   * @private
   */
  private async syncBeat(event: BeatEvent) {
    if (!this.playState.is_playing) return;

    let beat = '';

    if (this.ping) beat += 'beat:   . ';
    if (!this.ping) beat += 'beat:  .  ';
    this.ping = !this.ping;

    beat += `: ${event.beat.start} (${event.beat.confidence}) - ${event.section?.start} - ${event.section?.loudness}`;
    console.log(beat);

    this.beatEmitter.emit('beat', event);
  }
}
