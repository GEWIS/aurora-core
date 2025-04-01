import { Namespace } from 'socket.io';
import { EventParams } from 'socket.io/dist/typed-events';
import { BaseHandler } from '@gewis/aurora-core-util';
import { ScreenEntity as Screen } from '@gewis/aurora-core-screen';
import { TrackChangeEvent } from '@gewis/aurora-core-audio-handler';
import { SocketioNamespaces } from '@gewis/aurora-core-util';
import { ShowOrdersEvent } from '@gewis/aurora-core-order-plugin';

export default abstract class BaseScreenHandler extends BaseHandler<Screen> {
  constructor(private socket: Namespace) {
    super();
  }

  // TODO this should not be here?
  abstract changeTrack(event: TrackChangeEvent[]): void;

  // TODO this should not be used?
  public showOrders(event: ShowOrdersEvent): void {
    this.sendEvent('orders', event);
  }

  /**
   * Send an event with the given name and given arguments to the given screen
   * @param screen
   * @param eventName
   * @param args
   * @protected
   */
  protected sendEventToScreen(screen: Screen, eventName: string, ...args: EventParams<any, any>) {
    const socketId = screen.getSocketId(this.socket.name as SocketioNamespaces);
    this.socket.sockets.get(socketId || '')?.emit(eventName, args);
  }

  /**
   * Send an event with the given name and given arguments to all screens
   * using this handler
   * @param eventName
   * @param args
   * @protected
   */
  protected sendEvent(eventName: string, ...args: EventParams<any, any>) {
    this.entities.forEach((screen) => {
      this.sendEventToScreen(screen, eventName, ...args);
    });
  }
}
