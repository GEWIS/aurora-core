import {
  Body, Controller, Get, Post, Route, Security, Tags,
} from 'tsoa';
import { Audio } from './entities';
import RootAudioService, { AudioCreateParams } from './root-audio-service';
import { SecurityGroup } from '../../helpers/security';

export type AudioResponse = Pick<Audio, 'id' | 'createdAt' | 'updatedAt' | 'name'>;

@Route('audio')
@Tags('Audios')
export class RootAudioController extends Controller {
  @Security('local', ['*'])
  @Get()
  public async getAudios() {
    return new RootAudioService().getAllAudios();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post()
  public async createAudio(@Body() params: AudioCreateParams) {
    return new RootAudioService().createAudio(params);
  }
}
