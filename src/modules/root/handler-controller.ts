import { Controller, Path } from '@tsoa/runtime';
import {
  Body, Get, Post, Route,
} from 'tsoa';
import HandlerManager from './handler-manager';
import { Audio } from './entities';
import RootAudioService from './root-audio-service';

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
}
