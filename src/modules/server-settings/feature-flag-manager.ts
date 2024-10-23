import { ISettings } from './server-setting';
import ServerSettingsStore, { FeatureFlagResponse } from './server-settings-store';
import BaseHandler from '../handlers/base-handler';

type HandlerClass = new (...args: any[]) => BaseHandler<any>;

/**
 * Being an extension of the ServerSettingsStore, the Feature Flag Manager is responsible for
 * - as the name suggests - all feature flags present in the system. It does not say whether
 * a flag is enabled or not, but it does keep track of all other operations regarding those flags.
 */
export default class FeatureFlagManager {
  private static instance: FeatureFlagManager;

  private featureFlags = new Set<keyof ISettings>();

  private handlerFeatureFlags = new Map<HandlerClass, keyof ISettings>();

  private serverSettingsStore: ServerSettingsStore;

  constructor() {
    this.serverSettingsStore = ServerSettingsStore.getInstance();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new FeatureFlagManager();
    }
    return this.instance;
  }

  /**
   * Mark a setting as a feature flag, such that the backoffice can request
   * which feature flags exists and whether they are enabled/disabled
   * @param key
   */
  public registerFeatureFlag(key: keyof ISettings) {
    this.featureFlags.add(key);
  }

  /**
   * Assign a handler to a feature flag
   * @param Handler The handler class
   * @param featureFlag The feature flag that decides whether this handler is enabled or not
   */
  public registerHandlerWithFeatureFlag(Handler: HandlerClass, featureFlag: keyof ISettings) {
    this.handlerFeatureFlags.set(Handler, featureFlag);
    this.featureFlags.add(featureFlag);
  }

  /**
   * Get a list of all feature flags and whether they are enabled or disabled
   */
  public getFeatureFlags(): FeatureFlagResponse {
    const response: FeatureFlagResponse = [];
    this.featureFlags.forEach((key) => {
      response.push({
        key,
        value: !!this.serverSettingsStore.getSetting(key as keyof ISettings),
      });
    });
    return response;
  }

  public handlerIsEnabled(Handler: HandlerClass): boolean {
    const flag = this.handlerFeatureFlags.get(Handler);

    // If we do not know the handler, it does not have a feature flag, so it is enabled by default
    if (!flag) return true;

    const setting = this.serverSettingsStore.getSetting(flag);
    return !!setting;
  }
}
