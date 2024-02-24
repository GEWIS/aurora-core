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

export type Song = {
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
