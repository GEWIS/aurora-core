import { Poster } from './poster';

export abstract class PosterManager {
  protected _posters: Poster[];

  abstract fetchPosters(): Promise<Poster[]>;

  public get posters() {
    return this._posters;
  }
}
