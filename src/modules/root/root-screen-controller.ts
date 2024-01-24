import {
  Body, Get, Post, Route, Security, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import RootScreenService, { ScreenCreateParams } from './root-screen-service';
import { SecurityGroup } from '../../helpers/security';

@Route('screen')
@Tags('Screens')
export class RootScreenController extends Controller {
  @Security('local', ['*'])
  @Get()
  public async getScreens() {
    return new RootScreenService().getAllScreens();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post()
  public async createScreen(@Body() params: ScreenCreateParams) {
    return new RootScreenService().createScreen(params);
  }
}
