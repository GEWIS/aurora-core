import BaseMode from './base-mode';
import { MusicEmitter } from '../events';
import { BackofficeSyncEmitter } from '../events/backoffice-sync-emitter';

export default class ModeManager {
  private static instance: ModeManager;

  private _musicEmitter: MusicEmitter;

  private _backofficeSyncEmitter: BackofficeSyncEmitter;

  private modes: Map<typeof BaseMode, BaseMode<any, any, any> | undefined> = new Map();

  private initialized = false;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ModeManager();
    }
    return this.instance;
  }

  public init(musicEmitter: MusicEmitter, backofficeEmitter: BackofficeSyncEmitter) {
    if (this.initialized) throw new Error('ModeManager already initialized');
    this._musicEmitter = musicEmitter;
    this._backofficeSyncEmitter = backofficeEmitter;
    this.initialized = true;
  }

  public enableMode(
    modeClass: typeof BaseMode<any, any, any>,
    mode: BaseMode<any, any, any>,
    name: string,
  ) {
    // If an instance of this mode already exist, destroy it before creating a new one
    if (this.modes.has(modeClass)) this.disableMode(modeClass);

    this.modes.set(modeClass, mode);
    this._backofficeSyncEmitter.emit(`mode_${name}_update`);
  }

  public getMode(modeClass: typeof BaseMode<any, any, any>) {
    return this.modes.get(modeClass);
  }

  public disableMode(modeClass: typeof BaseMode<any, any, any>, name?: string) {
    const instance = this.modes.get(modeClass);
    if (instance) instance.destroy();
    if (name) this._backofficeSyncEmitter.emit(`mode_${name}_update`);
    return this.modes.delete(modeClass);
  }

  public get musicEmitter() {
    return this._musicEmitter;
  }

  public get backofficeSyncEmitter() {
    return this._backofficeSyncEmitter;
  }

  /**
   * Stops all modes
   */
  public reset() {
    this.modes.forEach((mode, modeClass) => {
      mode?.destroy();
      this.modes.delete(modeClass);
    });
  }
}
