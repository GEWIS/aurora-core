import { Namespace } from 'socket.io';
import BaseScreenHandler from '../../base-screen-handler';
import { TrackChangeEvent } from '../../../events/music-emitter-events';
import { PosterManager } from '../../../posters/poster-manager';
import { TrelloPosterManager } from '../../../posters/trello/trello-poster-manager';

export class PosterScreenHandler extends BaseScreenHandler {
  public posterManager: PosterManager;

  constructor(socket: Namespace) {
    super(socket);
    this.posterManager = new TrelloPosterManager();
  }

  forceUpdate(): void {
    this.socket.emit('update_posters');
  }

  // Do nothing
  beat(): void {}

  changeTrack(event: TrackChangeEvent[]): void {
    this.socket.emit('change_track', event);
  }
}
