import { Namespace } from 'socket.io';
import BaseHandler from './base-handler';
import Screen from '../root/entities/screen';
import { TrackChangeEvent } from '../events/music-emitter-events';

export default abstract class BaseScreenHandler extends BaseHandler<Screen> {
  constructor(protected socket: Namespace) {
    super();
  }

  abstract changeTrack(event: TrackChangeEvent[]): void;
}
