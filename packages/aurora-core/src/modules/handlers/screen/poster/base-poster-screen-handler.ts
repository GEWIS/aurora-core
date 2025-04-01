import { Namespace } from 'socket.io';
import { TrackChangeEvent } from '@gewis/aurora-core-audio-handler';
import { PosterManager } from './poster-manager';
import { TrelloPosterManager } from './trello/trello-poster-manager';
import { BaseScreenHandler } from '@gewis/aurora-core-screen';

export default abstract class BasePosterScreenHandler extends BaseScreenHandler {
  public posterManager: PosterManager;

  // TODO pass poster manager as option
  constructor(socket: Namespace) {
    super(socket);
    this.posterManager = new TrelloPosterManager();
  }

  forceUpdate(): void {
    this.sendEvent('update_posters');
  }

  // Do nothing
  beat(): void {}

  // TODO make this a "custom" handler that extens BaseScreen? ChangeTrack should be something special; I assume
  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }
}
