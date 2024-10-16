import { Controller, Get, Route, Security, Tags } from 'tsoa';
import { Response } from '@tsoa/runtime';
import SudoSOSService from './sudosos-service';
import { SecurityGroup } from '../../helpers/security';
import { EndpointEnabled } from '../server-settings';

@Tags('Handlers')
@Route('handler/screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Security('local', [SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('wall-of-shame')
  @EndpointEnabled('SudoSOSEnabled')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async getSudoSOSWallOfShame() {
    return (await new SudoSOSService().initialize()).getDebtors();
  }

  @Security('local', [SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('price-list')
  @EndpointEnabled('SudoSOSEnabled')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public async getSudoSOSPriceList() {
    return (await new SudoSOSService().initialize()).getPriceList();
  }
}
