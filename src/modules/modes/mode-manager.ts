import BaseMode from './base-mode';
import { MusicEmitter } from '../events';

export default class ModeManager {
  private static instance: ModeManager;

  private _musicEmitter: MusicEmitter;

  private modes: Map<typeof BaseMode, BaseMode | undefined> = new Map();

  private initialized = false;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ModeManager();
    }
    return this.instance;
  }

  public init(musicEmitter: MusicEmitter) {
    if (this.initialized) throw new Error('ModeManager already initialized');
    this._musicEmitter = musicEmitter;
    this.initialized = true;
  }

  public enableMode(modeClass: typeof BaseMode, mode: BaseMode) {
    // If an instance of this mode already exist, destroy it before creating a new one
    if (this.modes.has(modeClass)) this.disableMode(modeClass);

    this.modes.set(modeClass, mode);
  }

  public getMode(modeClass: typeof BaseMode) {
    return this.modes.get(modeClass);
  }

  public disableMode(modeClass: typeof BaseMode) {
    const instance = this.modes.get(modeClass);
    if (instance) instance.destroy();
    return this.modes.delete(modeClass);
  }

  public get musicEmitter() {
    return this._musicEmitter;
  }
}
