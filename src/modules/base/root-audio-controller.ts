import {
  Body, Controller, Get, Post, Route,
} from 'tsoa';
import { Audio } from './entities';
import RootAudioService, { AudioCreateParams } from './root-audio-service';

export type AudioResponse = Pick<Audio, 'id' | 'createdAt' | 'updatedAt' | 'name'>;

@Route('audio')
export class RootAudioController extends Controller {
  @Get()
  public async getAudios() {
    return new RootAudioService().getAllAudios();
  }

  @Post()
  public async createAudio(@Body() params: AudioCreateParams) {
    return new RootAudioService().createAudio(params);
  }
}
