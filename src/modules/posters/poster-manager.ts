import { Poster } from './poster';

export abstract class PosterManager {
  protected _posters: Poster[] | undefined;

  abstract fetchPosters(): Promise<Poster[]>;

  public get posters() {
    return this._posters;
  }
}
