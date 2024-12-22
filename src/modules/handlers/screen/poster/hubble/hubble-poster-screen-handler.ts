import BasePosterScreenHandler from '../base-poster-screen-handler';
import { Namespace } from 'socket.io';
import { FeatureEnabled } from '../../../../server-settings';

@FeatureEnabled('HubblePosterScreenHandler')
export default class HubblePosterScreenHandler extends BasePosterScreenHandler {
  constructor(socket: Namespace) {
    super(socket);
  }
}
