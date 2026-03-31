import BaseScreenHandler from '../../base-screen-handler';
import { TrackChangeEvent } from '../../../events/music-emitter-events';
import { StaticPosterResponse } from './static/static-poster-service';
import { FeatureEnabled } from '../../../server-settings';

const UPDATE_POSTER_EVENT_NAME = 'update_static_poster';
const DEFAULT_CLOCK_VISIBLE = true;

export interface StaticPosterHandlerState {
  activePoster: StaticPosterResponse | null;
  clockVisible: boolean;
}

@FeatureEnabled('Poster')
export default class StaticPosterHandler extends BaseScreenHandler {
  private activePoster: StaticPosterResponse | null;

  private clockVisible = DEFAULT_CLOCK_VISIBLE;

  getState(): StaticPosterHandlerState {
    return {
      activePoster: this.activePoster,
      clockVisible: this.clockVisible,
    };
  }

  /**
   * Change the currently active poster
   * @param poster
   */
  setActivePoster(poster: StaticPosterResponse): void {
    this.activePoster = poster;
    this.sendEvent(UPDATE_POSTER_EVENT_NAME, this.getState());
  }

  /**
   * Remove the currently active poster (set it to nothing)
   */
  removeActivePoster(): void {
    this.activePoster = null;
    this.sendEvent(UPDATE_POSTER_EVENT_NAME, this.getState());
  }

  /**
   * Change the visibility of the clock on-screen
   * @param visible
   */
  setClockVisibility(visible: boolean): void {
    this.clockVisible = visible;
    this.sendEvent(UPDATE_POSTER_EVENT_NAME, this.getState());
  }

  beat(): void {}

  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }

  reset() {
    super.reset();
    this.clockVisible = DEFAULT_CLOCK_VISIBLE;
    this.removeActivePoster();
  }
}
