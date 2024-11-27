import { Namespace } from 'socket.io';
import BaseScreenHandler from '../../base-screen-handler';
import { TrackChangeEvent } from '../../../events/music-emitter-events';
import { PosterManager } from './poster-manager';
import { TrelloPosterManager } from './trello/trello-poster-manager';

export default class BasePosterScreenHandler extends BaseScreenHandler {
  public posterManager: PosterManager;

  constructor(socket: Namespace) {
    super(socket);
    this.posterManager = new TrelloPosterManager();
  }

  forceUpdate(): void {
    this.sendEvent('update_posters');
  }

  // Do nothing
  beat(): void {}

  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }
}
