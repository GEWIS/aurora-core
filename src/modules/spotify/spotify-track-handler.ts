import {
  AudioAnalysis, AudioFeatures, Track,
} from '@spotify/web-api-ts-sdk';
import SpotifyApiHandler from './spotify-api-handler';

export default class SpotifyTrackHandler {
  private static instance: SpotifyTrackHandler;

  private initialized = false;

  private syncLoopTimer;

  private readonly api: SpotifyApiHandler;

  private currentlyPlaying: Track;

  private currentlyPlayingFeatures: AudioFeatures;

  private currentlyPlayingAnalysis: AudioAnalysis;

  private constructor() {
    this.api = SpotifyApiHandler.getInstance();
    this.syncLoopTimer = setInterval(this.syncLoop.bind(this), 5000);
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SpotifyTrackHandler();
    }
    return this.instance;
  }

  public async init() {
    if (this.initialized) throw new Error('SpotifyTrackHandler is already initialized!');
    this.initialized = true;
  }

  /**
   * Main event loop to get the currently playing song
   * @private
   */
  private async syncLoop() {
    console.log('Start Spotify sync job');
    if (!this.api.client) return;

    const state = await this.api.client.player.getCurrentlyPlayingTrack();

    if (state.currently_playing_type === 'track' && (!this.currentlyPlaying || this.currentlyPlaying.id !== state.item.id)) {
      this.currentlyPlaying = state.item as Track;

      this.currentlyPlayingFeatures = await this.api.client.tracks
        .audioFeatures(this.currentlyPlaying.id);
      this.currentlyPlayingAnalysis = await this.api.client.tracks
        .audioAnalysis(this.currentlyPlaying.id);

      console.log(this.currentlyPlayingFeatures);
    }
  }
}
