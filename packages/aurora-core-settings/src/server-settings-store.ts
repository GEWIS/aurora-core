import { DataSourceSingleton } from "@gewis/aurora-core-database-util";
import { ServerSetting } from './server-setting';

/**
 * Store of global server settings, which are key-value pairs stored in the database.
 * Used for settings that fit a database store better than an environment variable,
 * as the latter should contain mostly secrets to get things to work, not to
 * configure stuff.
 */
export default class ServerSettingsStore {
  private static instance: ServerSettingsStore;

  /**
   * We maintain for each setting whether it has been initialized
   * This is used to have various modules use the same settings store
   * @private
   */
  private initializedSettings = Map<string, boolean>
  private settings: Record<string, any>;

  /**
   * Singleton, because there is only one copy of the core running at a time.
   * We can therefore simply initialize the store once and keep it up to date
   * from memory.
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new ServerSettingsStore();
    }
    return this.instance;
  }

  /**
   * Whether the specific setting is initialized
   */
  public isInitialized(settingName: string) {
    return this.initializedSettings[settingName];
  }

  /**
   * Throw an error if specific setting is not initialized
   */
  private throwIfNotInitialized(settingName: string) {
    if (!this.initializedSettings[settingName]) {
      throw new Error(`ServerSettingsStore has not been initialized for ${settingName}`);
    }
  }

  public async initialize<T>(settingName: string, defaultSetting: T) {
    if (this.initializedSettings[settingName]) {
      throw new Error(`ServerSettingsStore already initialized for ${settingName}`);
    }

    const repo = DataSourceSingleton.getInstance().get().getRepository(ServerSetting<T>);
    const settings = await repo.find();
    const promises: Promise<ServerSetting<T>>[] = [];

    // Save any new key-value pairs to the database if they don't yet exist
    Object.entries(defaultSetting).forEach((entry) => {
      const key = entry[0] as keyof T;
      const value = entry[1];
      const setting = settings.find((s: ServerSetting<T>) => s.key === key);
      if (!setting) {
        const promise = repo.save({ key, value });
        // Add the missing setting key with its default value
        promises.push(promise);
      }
    });

    // The settings object now contains all key-value pairs
    settings.push(...(await Promise.all(promises)));

    const map = new Map<ServerSetting<T>['key'], ServerSetting<T>['value']>();
    Object.keys(defaultSetting).forEach((key) => {
      const setting = settings.find((s: ServerSetting<T>) => s.key === key);
      if (!setting) throw new Error(`Setting "${key}" missing during initialization`);
      map.set(setting.key, setting.value);
    });

    // Add to existing settings
    this.settings = {
      ...this.settings,
      ...Object.fromEntries(map)
    };
    this.initializedSettings[settingName] = true;
  }

  /**
   * Return whether the given key is a server setting
   * @param key
   */
  public hasSetting(key: string): boolean {
    return Object.keys(this.settings).includes(key);
  }

  /**
   * Get all server settings.
   */
  public getSettings<T>(settingName: string): T {
    this.throwIfNotInitialized(settingName)
    return this.settings as T;
  }

  /**
   * Get a server setting
   * @param settingName
   * @param key
   */
  public getSetting<T, K extends keyof T = keyof T>(settingName: string, key: K): T[K] {
    this.throwIfNotInitialized(settingName)
    return (this.settings as T)[key];
  }

  /**
   * Update a server setting
   * @param settingsName
   * @param key
   * @param value
   */
  public async setSetting<T, K extends keyof T = keyof T>(settingsName: string, key: K, value: T[K]) {
    this.throwIfNotInitialized(settingsName);
    const repo = DataSourceSingleton.getInstance().get().getRepository(ServerSetting<T>);
    // @ts-ignore - this works fine, but the compiler complains
    const setting = await repo.findOne({ where: { key: key } });
    setting!.value = value;
    const result = await repo.save(setting!);
    (this.settings as T)[key] = value;
    return result;
  }
}
