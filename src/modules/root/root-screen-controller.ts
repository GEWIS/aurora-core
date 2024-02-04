import {
  Body, Get, Post, Route, Security, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import RootScreenService, { ScreenCreateParams, ScreenResponse } from './root-screen-service';
import { SecurityGroup } from '../../helpers/security';

@Route('screen')
@Tags('Screens')
export class RootScreenController extends Controller {
  @Security('local', ['*'])
  @Get()
  public async getScreens(): Promise<ScreenResponse[]> {
    const screens = await new RootScreenService().getAllScreens();
    return screens.map((s) => RootScreenService.toScreenResponse(s));
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post()
  public async createScreen(@Body() params: ScreenCreateParams): Promise<ScreenResponse> {
    const screen = await new RootScreenService().createScreen(params);
    return RootScreenService.toScreenResponse(screen);
  }
}
