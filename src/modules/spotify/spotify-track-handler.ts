import {
  AudioAnalysis, AudioFeatures, PlaybackState, Track,
} from '@spotify/web-api-ts-sdk';
import SpotifyApiHandler from './spotify-api-handler';
import { MusicEmitter } from '../events';
import { BeatEvent, TrackPropertiesEvent } from '../events/music-emitter-events';

export default class SpotifyTrackHandler {
  private static instance: SpotifyTrackHandler;

  private initialized = false;

  private syncLoopTimer?: NodeJS.Timeout;

  private readonly api: SpotifyApiHandler;

  private playState: PlaybackState | undefined;

  private currentlyPlayingFeatures: AudioFeatures | undefined;

  private currentlyPlayingAnalysis: AudioAnalysis | undefined;

  private beatEvents: {
    event: BeatEvent,
    timeout: NodeJS.Timeout
  }[];

  private musicEmitter: MusicEmitter;

  private ping = false;

  private constructor() {
    this.api = SpotifyApiHandler.getInstance();
    setInterval(this.syncLoop.bind(this), 5000);
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
    this.musicEmitter = emitter;
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

  private setNextTrackEvent(state: PlaybackState): void {
    if (!state.is_playing) return;
    if (this.syncLoopTimer) {
      clearTimeout(this.syncLoopTimer);
      this.syncLoopTimer = undefined;
    }

    this.syncLoopTimer = setTimeout(
      this.syncLoop.bind(this),
      state.item.duration_ms - state.progress_ms + 10,
    );
  }

  private setBeatEvents(track?: AudioAnalysis) {
    this.stopBeatEvents();

    const progress = this.playState?.progress_ms || 0;

    this.beatEvents = track ? track.beats
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
      }) : [];
  }

  /**
   * Main event loop to get the currently playing song
   * @private
   */
  private async syncLoop() {
    if (!this.api.client) return;

    const state = await this.api.client.player.getCurrentlyPlayingTrack();

    if (state && state.currently_playing_type === 'track' && (!this.playState || this.playState.item?.id !== state.item?.id)) {
      this.currentlyPlayingFeatures = await this.api.client.tracks
        .audioFeatures(state.item.id);
      this.currentlyPlayingAnalysis = await this.api.client.tracks
        .audioAnalysis(state.item.id);

      this.emitTrackFeatures(this.currentlyPlayingFeatures);
      this.setNextTrackEvent(state);

      const item = state.item as Track;

      console.log(`Now playing: ${item.artists.map((a) => a.name).join(', ')} - ${item.name}`);
    }

    if ((!state || !state.is_playing) && this.playState && this.playState.is_playing) {
      this.stopBeatEvents();
      this.currentlyPlayingFeatures = undefined;
      this.currentlyPlayingAnalysis = undefined;
    }

    this.playState = state;

    this.setBeatEvents(this.currentlyPlayingAnalysis);
  }

  /**
   * Event loop that is called at every beat of the currently playing track
   * @private
   */
  private async syncBeat(event: BeatEvent) {
    if (!this.playState || !this.playState.is_playing) return;

    let beat = '';

    if (this.ping) beat += 'beat:   . ';
    if (!this.ping) beat += 'beat:  .  ';
    this.ping = !this.ping;

    beat += `: ${event.beat.start} (${event.beat.confidence}) - ${event.section?.start} - ${event.section?.loudness}`;
    console.log(beat);

    this.musicEmitter.emitSpotify('beat', event);
  }

  /**
   * Send the features of the currently playing track to all handlers
   * @param features
   * @private
   */
  private emitTrackFeatures(features: AudioFeatures) {
    const event: TrackPropertiesEvent = {
      bpm: features.tempo,
      danceability: features.danceability,
      energy: features.energy,
      loudness: features.loudness,
      valence: features.valence,
    };
    this.musicEmitter.emitSpotify('features', event);
  }
}
