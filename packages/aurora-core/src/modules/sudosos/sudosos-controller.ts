import { Controller, Get, Route, Security, Tags } from 'tsoa';
import { Response } from '@tsoa/runtime';
import SudoSOSService from './sudosos-service';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';

@Tags('Handlers')
@Route('handler/screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.sudosos.subscriber)
  @Get('wall-of-shame')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async getSudoSOSWallOfShame() {
    return (await new SudoSOSService().initialize()).getDebtors();
  }

  @Security(SecurityNames.LOCAL, securityGroups.sudosos.subscriber)
  @Get('price-list')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async getSudoSOSPriceList() {
    return (await new SudoSOSService().initialize()).getPriceList();
  }
}
