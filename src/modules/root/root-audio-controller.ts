import {
  Body, Controller, Get, Post, Route, Security, Tags,
} from 'tsoa';
import RootAudioService, { AudioCreateParams, AudioResponse } from './root-audio-service';
import { SecurityGroup } from '../../helpers/security';

@Route('audio')
@Tags('Audios')
export class RootAudioController extends Controller {
  @Security('local', ['*'])
  @Get()
  public async getAudios(): Promise<AudioResponse[]> {
    const audios = await new RootAudioService().getAllAudios();
    return audios.map((a) => RootAudioService.toAudioResponse(a));
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post()
  public async createAudio(@Body() params: AudioCreateParams): Promise<AudioResponse> {
    const audio = await new RootAudioService().createAudio(params);
    return RootAudioService.toAudioResponse(audio);
  }
}
