import { Controller, TsoaResponse } from '@tsoa/runtime';
import { Body, Get, Post, Res, Route, Security, Tags } from 'tsoa';
import { SecurityGroup, SecurityNames } from '../../helpers/security';
import ServerSettingsStore from './server-settings-store';
import { ISettings } from './server-setting';
import FeatureFlagManager from './feature-flag-manager';
import { securityGroups } from '../../helpers/security-groups';

type SetServerSettingRequest = {
  key: string;
  value: any;
};

@Tags('ServerSettings')
@Route('settings')
export class ServerSettingsController extends Controller {
  /**
   * Get all server settings. NOTE: this can include secrets
   * like private keys!
   */
  @Security(SecurityNames.LOCAL, securityGroups.serverSettings.privileged)
  @Get('')
  public async getSettings() {
    return ServerSettingsStore.getInstance().getSettings();
  }

  /**
   * Change the value of a server setting
   * @param request
   * @param validationErrorResponse
   */
  @Security(SecurityNames.LOCAL, securityGroups.serverSettings.privileged)
  @Post('')
  public async setSetting(
    @Body() request: SetServerSettingRequest,
    @Res() validationErrorResponse: TsoaResponse<400, string>,
  ) {
    const store = ServerSettingsStore.getInstance();
    if (!store.hasSetting(request.key)) {
      return validationErrorResponse(400, `Setting with key "${request.key}" not found.`);
    }

    const key = request.key as keyof ISettings;
    const currentValue = store.getSetting(key);
    const currentType = typeof currentValue;
    const newType = typeof request.value;
    if (typeof currentValue !== typeof request.value) {
      return validationErrorResponse(
        400,
        `Setting with key "${request.key}" does not have the correct value type. Expected "${currentType}", but received "${newType}".`,
      );
    }

    await store.setSetting(key, request.value);
    const newValue = store.getSetting(key);
    return { key, value: newValue };
  }

  /**
   * Get a list of all feature flags and whether they are enabled/disabled.
   */
  @Security(SecurityNames.LOCAL, securityGroups.serverSettings.base)
  @Get('feature-flags')
  public getFeatureFlags() {
    return FeatureFlagManager.getInstance().getFeatureFlags();
  }
}
