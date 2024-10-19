import { ISettings } from './server-setting';
import ServerSettingsStore from './server-settings-store';

/**
 * Throws an error if the value of the given setting key evaluates to "false"
 * when the class is being created.
 * @param setting
 */
export default function ServiceEnabled(setting: keyof ISettings) {
  return function IServiceEnabled<T extends { new (...args: any[]): {} }>(constr: T) {
    return class extends constr {
      constructor(...args: any[]) {
        const store = ServerSettingsStore.getInstance();
        store.throwIfNotInitialized();

        const value = store.getSetting(setting);
        if (!value) {
          throw new Error(`Class "${constr.name}" is disabled by setting "${setting}"`);
        }

        super(args);
      }
    };
  };
}
