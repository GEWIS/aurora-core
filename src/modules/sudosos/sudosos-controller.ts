import { Controller, Get, Route, Tags } from 'tsoa';
import SudoSOSService from './sudosos-service';

@Tags('Poster screen')
@Route('screen/poster/sudosos')
export class SudoSOSController extends Controller {
  @Get('wall-of-shame')
  public async getSudoSOSWallOfShame() {
    return new SudoSOSService().getDebtors();
  }

  @Get('price-list')
  public async getSudoSOSPriceList() {
    return new SudoSOSService().getPriceList();
  }
}
