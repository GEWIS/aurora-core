import { Get, Route, Security, Tags } from 'tsoa';
import { Controller } from '@tsoa/runtime';
import { ServerSettingsStore } from '@gewis/aurora-core-server-settings';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';
import { ScreenHandlerSettings } from './screen-handler-settings';

@Route('handler/screen/poster')
@Tags('Handlers')
export class RoomResponsibleLegacyController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('room-responsible-legacy-url')
  public getRoomResponsibleLegacyUrl(): string {
    return ServerSettingsStore.getInstance().getSetting<ScreenHandlerSettings>(
      'screenHandler',
      'RoomResponsibleLegacyScreenURL',
    ) as ScreenHandlerSettings['RoomResponsibleLegacyScreenURL'];
  }
}
