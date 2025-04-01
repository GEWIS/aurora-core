import { Namespace } from 'socket.io';
import { MusicEmitter, musicEmitter } from '@gewis/aurora-core-audio-handler';
import { BackofficeSyncEmitter } from '../events/backoffice-sync-emitter';
import EmitterStore, { backofficeSyncEmitter, orderEmitter } from '../events/emitter-store';
import { OrderEmitter } from '../events/order-emitter';

// TODO this should be defined per plugin > "emitmessage, type"
export default function initBackofficeSynchronizer(socket: Namespace, emitterStore: EmitterStore) {
  emitterStore.get<MusicEmitter>(musicEmitter).on('beat', (event) => {
    socket.emit('beat', event);
  });
  emitterStore.get<MusicEmitter>(musicEmitter).on('change_track', (event) => {
    socket.emit('change_track', event);
  });
  emitterStore.get<BackofficeSyncEmitter>(backofficeSyncEmitter).on('*', (eventName: string, ...args: any[]) => {
    socket.emit(eventName, ...args);
  });
  emitterStore.get<OrderEmitter>(orderEmitter).on('orders', (event) => {
    socket.emit('orders', event);
  });
}
