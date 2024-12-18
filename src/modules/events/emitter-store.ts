import { BackofficeSyncEmitter } from './backoffice-sync-emitter';
import { MusicEmitter } from './music-emitter';
import { OrderEmitter } from './order-emitter';

export default class EmitterStore {
  private static instance: EmitterStore;

  public readonly backofficeSyncEmitter: BackofficeSyncEmitter;

  public readonly musicEmitter: MusicEmitter;

  public readonly orderEmitter: OrderEmitter;

  constructor() {
    this.backofficeSyncEmitter = new BackofficeSyncEmitter();
    this.musicEmitter = new MusicEmitter();
    this.orderEmitter = new OrderEmitter();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EmitterStore();
    }
    return this.instance;
  }
}
