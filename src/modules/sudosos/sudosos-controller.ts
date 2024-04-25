import { Controller, Get, Route, Tags } from 'tsoa';
import SudoSOSService from './sudosos-service';

@Tags('Poster screen')
@Route('screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Get('wall-of-shame')
  public async getSudoSOSWallOfShame() {
    return (await new SudoSOSService().initialize()).getDebtors();
  }

  @Get('price-list')
  public async getSudoSOSPriceList() {
    return (await new SudoSOSService().initialize()).getPriceList();
  }
}
