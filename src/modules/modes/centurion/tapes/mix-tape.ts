import { LightsEffectBuilder } from '../../../lights/effects/lights-effect';

type Horn = {
  type: 'horn',
  data: {
    counter: number,
  },
};

export type SongData = {
  artist: string,
  title: string,
};

type Song = {
  type: 'song',
  data: SongData | SongData[],
};

type Beat = {
  type: 'beat',
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
} & (Horn | Song | Beat | Effect | Other);

export default interface MixTape {
  name: string;
  songFile: string;
  feed: FeedEvent[];
  coverUrl: string;
}
