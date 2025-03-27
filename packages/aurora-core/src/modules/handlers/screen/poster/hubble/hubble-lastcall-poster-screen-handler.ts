import BasePosterScreenHandler from '../base-poster-screen-handler';
import { Namespace } from 'socket.io';

export default class HubbleLastcallPosterScreenHandler extends BasePosterScreenHandler {
  constructor(socket: Namespace) {
    super(socket);
  }
}
