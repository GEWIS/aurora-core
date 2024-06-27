import { BackofficeSyncEmitter } from './backoffice-sync-emitter';
import { MusicEmitter } from './music-emitter';

export default class EmitterStore {
  private static instance: EmitterStore;

  public readonly backofficeSyncEmitter: BackofficeSyncEmitter;

  public readonly musicEmitter: MusicEmitter;

  constructor() {
    this.backofficeSyncEmitter = new BackofficeSyncEmitter();
    this.musicEmitter = new MusicEmitter();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EmitterStore();
    }
    return this.instance;
  }
}
