import BaseScreenHandler from '../base-screen-handler';
import { BeatEvent, TrackChangeEvent } from '../../events/music-emitter-events';

export default class RoomResponsibleLegacyHandler extends BaseScreenHandler {
  beat(event: BeatEvent): void {}

  changeTrack(event: TrackChangeEvent[]): void {}
}
