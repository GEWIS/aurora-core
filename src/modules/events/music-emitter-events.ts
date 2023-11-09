import {
  Beat, Section, Segment, Tatum,
} from '@spotify/web-api-ts-sdk';

export interface BeatEvent {
  beat: Beat;
  segment?: Segment;
  section?: Section;
  tatum?: Tatum;
}

/**
 * To understand the meaning of these variables, please see
 * https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */
export interface TrackPropertiesEvent {
  bpm: number;
  danceability: number;
  energy: number;
  loudness: number;
  valence: number;
}

export interface TrackChangeEvent {
  title: string;
  artist: string;
}
