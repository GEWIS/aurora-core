import { Poster } from './poster';

export abstract class PosterManager {
  abstract getPosters(): Promise<Poster[]>;
}
