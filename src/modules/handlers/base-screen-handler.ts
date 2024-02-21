import { Namespace } from 'socket.io';
import { EventParams } from 'socket.io/dist/typed-events';
import BaseHandler from './base-handler';
import Screen from '../root/entities/screen';
import { TrackChangeEvent } from '../events/music-emitter-events';
import { SocketioNamespaces } from '../../socketio-namespaces';

export default abstract class BaseScreenHandler extends BaseHandler<Screen> {
  constructor(private socket: Namespace) {
    super();
  }

  abstract changeTrack(event: TrackChangeEvent[]): void;

  protected sendEvent(eventName: string, ...args: EventParams<any, any>) {
    this.entities.forEach((e) => {
      const socketId = e.getSocketId(this.socket.name as SocketioNamespaces);
      this.socket.sockets.get(socketId || '')?.emit(eventName, args);
    });
  }
}
