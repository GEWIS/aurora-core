import { Controller, Get, Route, Security, Tags } from 'tsoa';
import SudoSOSService from './sudosos-service';
import { SecurityNames } from '../../helpers/security';
import { securityGroups } from '../../helpers/security-groups';

@Tags('Handlers')
@Route('handler/screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.sudosos.subscriber)
  @Get('wall-of-shame')
  public async getSudoSOSWallOfShame() {
    return (await new SudoSOSService().initialize()).getDebtors();
  }

  @Security(SecurityNames.LOCAL, securityGroups.sudosos.subscriber)
  @Get('price-list')
  public async getSudoSOSPriceList() {
    return (await new SudoSOSService().initialize()).getPriceList();
  }
}
