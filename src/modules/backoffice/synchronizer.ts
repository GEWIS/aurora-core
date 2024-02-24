import { Namespace } from 'socket.io';
import { MusicEmitter } from '../events';
import logger from '../../logger';

interface Emitters {
  musicEmitter: MusicEmitter,
}

export default function initBackofficeSynchronizer(socket: Namespace, { musicEmitter }: Emitters) {
  musicEmitter.on('beat', (event) => {
    socket.emit('beat', event);
  });
  musicEmitter.on('change_track', (event) => {
    logger.info('Send change track event to backoffice');
    socket.emit('change_track', event);
  });
}
