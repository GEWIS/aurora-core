import BaseScreenHandler from '../../base-screen-handler';
import { TrackChangeEvent } from '../../../events/music-emitter-events';
import { Screen } from '../../../root/entities';
import { LocalPosterResponse } from './local/local-poster-service';

const UPDATE_POSTER_EVENT_NAME = 'update_poster';

export default class StaticPosterHandler extends BaseScreenHandler {
  private activePoster: LocalPosterResponse | null;

  registerEntity(entity: Screen) {
    super.registerEntity(entity);
    this.sendEventToScreen(entity, UPDATE_POSTER_EVENT_NAME, this.activePoster);
  }

  /**
   * Change the currently active poster
   * @param poster
   */
  setActivePoster(poster: LocalPosterResponse): void {
    this.activePoster = poster;
    this.sendEvent(UPDATE_POSTER_EVENT_NAME, poster);
  }

  /**
   * Remove the currently active poster (set it to nothing)
   */
  removeActivePoster(): void {
    this.activePoster = null;
    this.sendEvent(UPDATE_POSTER_EVENT_NAME, null);
  }

  beat(): void {}

  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }
}
