import { LightsEffectBuilder } from '../../../lights/effects/lights-effect';

export type HornData = {
  counter: number,
};

export type Horn = {
  type: 'horn',
  data: HornData,
};

export type SongData = {
  artist: string,
  title: string,
};

type Song = {
  type: 'song',
  data: SongData | SongData[],
};

type Effect = {
  type: 'effect',
  data: {
    effects: LightsEffectBuilder[],
  }
};

type Other = {
  type: 'other',
  data: any;
};

export type FeedEvent = {
  timestamp: number;
} & (Horn | Song | Effect | Other);

export default interface MixTape {
  name: string;
  songFile: string;
  feed: FeedEvent[];
  coverUrl: string;
}
