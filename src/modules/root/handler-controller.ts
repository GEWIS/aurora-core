import { Controller, Path } from '@tsoa/runtime';
import {
  Body, Get, Post, Route,
} from 'tsoa';
import HandlerManager from './handler-manager';
import { Audio } from './entities';
import RootAudioService from './root-audio-service';
import { LightsGroup } from '../lights/entities';
import RootLightsService from './root-lights-service';

@Route('handler')
export class HandlerController extends Controller {
  private handlersManager: HandlerManager;

  constructor() {
    super();
    this.handlersManager = HandlerManager.getInstance();
  }

  @Get('audio')
  public async getAudioHandlers() {
    return this.handlersManager.getHandlers(Audio).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities as Audio[],
    }));
  }

  @Post('audio/{id}')
  public async setAudioHandler(@Path() id: number, @Body() params: { name: string }) {
    const audio = await new RootAudioService().getSingleAudio(id);
    if (audio == null) {
      this.setStatus(404);
      return;
    }
    this.handlersManager.registerHandler(audio, params.name);
  }

  @Get('lights')
  public async getLightsHandlers() {
    return this.handlersManager.getHandlers(LightsGroup).map((h) => ({
      name: h.constructor.name,
      id: h.identifier,
      entities: h.entities as LightsGroup[],
    }));
  }

  @Post('lights/{id}')
  public async setLightsHandler(@Path() id: number, @Body() params: { name: string }) {
    const group = await new RootLightsService().getSingleLightGroup(id);
    if (group == null) {
      this.setStatus(404);
      return;
    }
    this.handlersManager.registerHandler(group, params.name);
  }
}
