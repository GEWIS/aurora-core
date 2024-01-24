import { Controller, Path } from '@tsoa/runtime';
import {
  Body, Get, Post, Route, Security, Tags,
} from 'tsoa';
import HandlerManager from './handler-manager';
import { Audio, Screen } from './entities';
import RootAudioService from './root-audio-service';
import { LightsGroup } from '../lights/entities';
import RootLightsService from './root-lights-service';
import RootScreenService from './root-screen-service';
import SubscribeEntity from './entities/subscribe-entity';
import { SecurityGroup } from '../../helpers/security';

interface HandlerResponse<T extends SubscribeEntity> {
  entities: T[];
  id: string;
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
  public getAudioHandlers(): HandlerResponse<Audio>[] {
    return this.handlersManager.getHandlers(Audio).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities as Audio[],
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('audio/{id}')
  public async setAudioHandler(@Path() id: number, @Body() params: { name: string }) {
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
  public getLightsHandlers(): HandlerResponse<LightsGroup>[] {
    return this.handlersManager.getHandlers(LightsGroup).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities as LightsGroup[],
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('lights/{id}')
  public async setLightsHandler(@Path() id: number, @Body() params: { name: string }) {
    const group = await new RootLightsService().getSingleLightGroup(id);
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
  public getScreenHandlers(): HandlerResponse<Screen>[] {
    return this.handlersManager.getHandlers(Screen).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities as Screen[],
    }));
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('screen/{id}')
  public async setScreenHandler(@Path() id: number, @Body() params: { name: string }) {
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
