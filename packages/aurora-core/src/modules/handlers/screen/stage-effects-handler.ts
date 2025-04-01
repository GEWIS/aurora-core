import { TrackChangeEvent, BeatEvent } from '@gewis/aurora-core-audio-handler';
import BaseScreenHandler from '../base-screen-handler';

export default class StageEffectsHandler extends BaseScreenHandler {
  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }

  beat(event: BeatEvent): void {
    this.sendEvent('beat', event);
  }
}
