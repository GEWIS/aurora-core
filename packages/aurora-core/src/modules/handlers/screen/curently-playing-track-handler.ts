import { BeatEvent, TrackChangeEvent } from '@gewis/aurora-core-audio-handler';
import { BaseScreenHandler } from '@gewis/aurora-core-screen';

export default class CurrentlyPlayingTrackHandler extends BaseScreenHandler {
  beat(event: BeatEvent): void {
    this.sendEvent('beat', event);
  }

  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }
}
