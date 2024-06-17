import { Controller, Get, Route, Security, Tags } from 'tsoa';
import SudoSOSService from './sudosos-service';
import { SecurityGroup } from '../../helpers/security';

@Tags('Handlers')
@Route('handler/screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Security('local', [SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('wall-of-shame')
  public async getSudoSOSWallOfShame() {
    return (await new SudoSOSService().initialize()).getDebtors();
  }

  @Security('local', [SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('price-list')
  public async getSudoSOSPriceList() {
    return (await new SudoSOSService().initialize()).getPriceList();
  }
}
