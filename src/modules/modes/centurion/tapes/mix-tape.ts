import { LightsEffectBuilder } from '../../../lights/effects/lights-effect';

export type HornData = {
  counter: number;
  /** Time the lights should strobe in milliseconds */
  strobeTime?: number;
};

export type Horn = {
  type: 'horn';
  data: HornData;
};

export type SongData = {
  /** Performing artists, comma-separated if multiple */
  artist: string;
  title: string;
  /** Tempo of the song. Defaults to 130 beats per minute */
  bpm?: number;
};

export type Song = {
  type: 'song';
  data: SongData | SongData[];
};

export type EffectData = {
  /**
   * Disable all lights (overrides effects and random)
   */
  reset?: boolean;
  /**
   * Enable an effect as if a new song is being played (overrides effects)
   */
  random?: boolean;
  /**
   * Set custom effects
   */
  effects: {
    pars?: LightsEffectBuilder[];
    movingHeadRgbColor?: LightsEffectBuilder[];
    movingHeadRgbMovement?: LightsEffectBuilder[];
    movingHeadWheelColor?: LightsEffectBuilder[];
    movingHeadWheelMovement?: LightsEffectBuilder[];
  };
};

type Effect = {
  type: 'effect';
  data: EffectData;
};

export type BpmData = {
  bpm: number;
};

type Bpm = {
  type: 'bpm';
  data: BpmData;
};

type Other = {
  type: 'other';
  data: any;
};

export type FeedEvent = {
  timestamp: number;
} & (Horn | Song | Effect | Bpm | Other);

export default interface MixTape {
  /** Arist and tape name combination should be unique */
  artist: string;
  name: string;
  /** Relative of absolute HTTP path to the audio file */
  songFile: string;
  /** List of events */
  feed: FeedEvent[];
  /** Relative or absolute HTTP path to the cover image */
  coverUrl: string;
  /** Duration of the whole mixtape (in seconds) */
  duration: number;
}
