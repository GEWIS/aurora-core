import BasePosterScreenHandler from '../base-poster-screen-handler';
import { Namespace } from 'socket.io';

export default class HubbleClosedPosterScreenHandler extends BasePosterScreenHandler {
  constructor(socket: Namespace) {
    super(socket);
  }
}
