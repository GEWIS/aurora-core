import { Controller, Path } from '@tsoa/runtime';
import {
  Body, Get, Post, Route, Security, Tags,
} from 'tsoa';
import HandlerManager from './handler-manager';
import { Audio, Screen } from './entities';
import RootAudioService, { AudioResponse } from './root-audio-service';
import { LightsGroup } from '../lights/entities';
import RootLightsService, { LightsGroupResponse } from './root-lights-service';
import RootScreenService, { ScreenResponse } from './root-screen-service';
import { SecurityGroup } from '../../helpers/security';

interface HandlerResponse<T> {
  entities: T[];
  id: string;
  name: string;
}

interface NewHandlerParams {
  name: string;
}

@Route('handler')
@Tags('Handlers')
export class HandlerController extends Controller {
  private handlersManager: HandlerManager;

  constructor() {
    super();
    this.handlersManager = HandlerManager.getInstance();
  }

  @Security('local', ['*'])
  @Get('audio')
  public getAudioHandlers(): HandlerResponse<AudioResponse>[] {
    return this.handlersManager.getHandlers(Audio).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities.map((audio) => RootAudioService.toAudioResponse(audio as Audio)),
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('audio/{id}')
  public async setAudioHandler(@Path() id: number, @Body() params: NewHandlerParams) {
    const audio = await new RootAudioService().getSingleAudio(id);
    if (audio == null) {
      this.setStatus(404);
      return;
    }

    const found = this.handlersManager.registerHandler(audio, params.name);
    if (!found) {
      this.setStatus(400);
    }
  }

  @Security('local', ['*'])
  @Get('lights')
  public getLightsHandlers(): HandlerResponse<LightsGroupResponse>[] {
    return this.handlersManager.getHandlers(LightsGroup).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities.map((lightsGroup) => RootLightsService
        .toLightsGroupResponse(lightsGroup as LightsGroup)),
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('lights/{id}')
  public async setLightsHandler(@Path() id: number, @Body() params: NewHandlerParams) {
    const group = await new RootLightsService().getSingleLightsGroup(id);
    if (group == null) {
      this.setStatus(404);
      return;
    }

    const found = this.handlersManager.registerHandler(group, params.name);
    if (!found) {
      this.setStatus(400);
    }
  }

  @Security('local', ['*'])
  @Get('screen')
  public getScreenHandlers(): HandlerResponse<ScreenResponse>[] {
    return this.handlersManager.getHandlers(Screen).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities.map((screen) => RootScreenService.toScreenResponse(screen)),
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('screen/{id}')
  public async setScreenHandler(@Path() id: number, @Body() params: NewHandlerParams) {
    const screen = await new RootScreenService().getSingleScreen(id);
    if (screen == null) {
      this.setStatus(404);
      return;
    }

    const found = this.handlersManager.registerHandler(screen, params.name);
    if (!found) {
      this.setStatus(400);
    }
  }
}
