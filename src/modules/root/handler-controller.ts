import { Controller, Path } from '@tsoa/runtime';
import { injectable } from 'tsyringe';
import {
  Body, Get, Post, Route,
} from 'tsoa';
import Handlers from './handlers';
import { Audio } from './entities';
import RootAudioService from './root-audio-service';

@injectable()
@Route('handler')
export class HandlerController extends Controller {
  constructor(private handlers: Handlers) {
    super();
  }

  @Get('audio')
  public async getAudioHandlers() {
    return this.handlers.getHandlers(Audio).map((h) => ({
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
    this.handlers.registerHandler(audio, params.name);
  }
}
