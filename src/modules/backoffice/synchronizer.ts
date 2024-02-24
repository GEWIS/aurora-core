import { Namespace } from 'socket.io';
import { MusicEmitter } from '../events';
import { BackofficeSyncEmitter } from '../events/backoffice-sync-emitter';

interface Emitters {
  musicEmitter: MusicEmitter,
  backofficeEmitter: BackofficeSyncEmitter,
}

export default function initBackofficeSynchronizer(
  socket: Namespace,
  { musicEmitter, backofficeEmitter }: Emitters,
) {
  musicEmitter.on('beat', (event) => {
    socket.emit('beat', event);
  });
  musicEmitter.on('change_track', (event) => {
    socket.emit('change_track', event);
  });
  backofficeEmitter.on('*', (eventName: string, ...args: any[]) => {
    socket.emit(eventName, ...args);
  });
}
