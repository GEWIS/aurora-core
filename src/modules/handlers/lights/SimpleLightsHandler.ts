import { Namespace } from 'socket.io';
import BaseLightsHandler from '../base-lights-handler';
import { BeatEmitter } from '../../events';

export default class SimpleLightsHandler extends BaseLightsHandler {
  private ping = false;

  constructor(socket: Namespace, beatEmitter: BeatEmitter) {
    super(socket, beatEmitter);

    this.beatEmitter.on('beat', (event) => {
      if (this.ping) {
        this.sendDataToController({
          dmx: [255, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          event,
        });
      } else {
        this.sendDataToController({
          dmx: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          event,
        });
      }
      this.ping = !this.ping;
    });
  }
}
