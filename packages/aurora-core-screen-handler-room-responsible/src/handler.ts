import { BaseScreenHandler } from '@gewis/aurora-core-screen';
import { BeatEvent, TrackChangeEvent } from '@gewis/aurora-core-audio-handler';

export default class RoomResponsibleLegacyHandler extends BaseScreenHandler {
  beat(event: BeatEvent): void {}

  changeTrack(event: TrackChangeEvent[]): void {}
}
