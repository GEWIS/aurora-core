import BaseMode from './base-mode';

export default class ModeManager {
  private static instance: ModeManager;

  private modes: Map<typeof BaseMode, BaseMode | undefined> = new Map();

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ModeManager();
    }
    return this.instance;
  }

  public enableMode(modeClass: typeof BaseMode, mode: BaseMode) {
    this.modes.set(modeClass, mode);
  }

  public getMode(modeClass: typeof BaseMode) {
    return this.modes.get(modeClass);
  }

  public disableMode(modeClass: typeof BaseMode) {
    return this.modes.delete(modeClass);
  }
}
