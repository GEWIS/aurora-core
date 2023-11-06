import {
  Body, Get, Post, Route, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import RootScreenService, { ScreenCreateParams } from './root-screen-service';

@Route('screen')
@Tags('Screens')
export class RootScreenController extends Controller {
  @Get()
  public async getScreens() {
    return new RootScreenService().getAllScreens();
  }

  @Post()
  public async createScreen(@Body() params: ScreenCreateParams) {
    return new RootScreenService().createScreen(params);
  }
}
