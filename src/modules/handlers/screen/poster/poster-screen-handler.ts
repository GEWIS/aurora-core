import BaseScreenHandler from '../../base-screen-handler';
import { TrackChangeEvent } from '../../../events/music-emitter-events';
import { Poster } from '../../../posters/poster';

export class PosterScreenHandler extends BaseScreenHandler {
  private _posters: Poster[] | undefined;

  // Do nothing
  beat(): void {}

  changeTrack(event: TrackChangeEvent[]): void {
    this.socket.emit('change_track', event);
  }

  public get posters() {
    return this._posters;
  }
}
