import { Namespace } from 'socket.io';
import { MusicEmitter } from '../events';
import { BackofficeSyncEmitter } from '../events/backoffice-sync-emitter';
import EmitterStore from '../events/emitter-store';

export default function initBackofficeSynchronizer(socket: Namespace, emitterStore: EmitterStore) {
  emitterStore.musicEmitter.on('beat', (event) => {
    socket.emit('beat', event);
  });
  emitterStore.musicEmitter.on('change_track', (event) => {
    socket.emit('change_track', event);
  });
  emitterStore.backofficeSyncEmitter.on('*', (eventName: string, ...args: any[]) => {
    socket.emit(eventName, ...args);
  });
  emitterStore.orderEmitter.on('orders', (event) => {
    socket.emit('orders', event);
  });
}
