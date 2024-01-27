import { Namespace } from 'socket.io';
import { MusicEmitter } from '../events';

interface Emitters {
  musicEmitter: MusicEmitter,
}

export default function initBackofficeSynchronizer(socket: Namespace, { musicEmitter }: Emitters) {
  musicEmitter.on('beat', (event) => {
    socket.emit('beat', event);
  });
}
