import { Body, Controller, Get, Post, Res, Route, Security, Tags, Request } from 'tsoa';
import { TsoaResponse } from '@tsoa/runtime';
import { Request as ExpressRequest } from 'express';
import RootAudioService, { AudioCreateParams, AudioResponse } from './root-audio-service';
import { SecurityGroup } from '../../helpers/security';
import HandlerManager from './handler-manager';
import { Audio } from './entities';
import logger from '../../logger';

interface SetAudioPlayingParams {
  playing: boolean;
}

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

  @Security('local', [SecurityGroup.AUDIO_SUBSCRIBER])
  @Post('{id}/playing')
  public async setAudioPlaying(
    id: number,
    @Request() req: ExpressRequest,
    @Body() params: SetAudioPlayingParams,
    @Res() forbiddenResponse: TsoaResponse<403, string>,
  ): Promise<void> {
    if (req.user!.audioId !== id) {
      forbiddenResponse(403, 'You can only set the playing state of yourself.');
      return;
    }

    logger.debug(`Update playing state for audio ${id}: ${JSON.stringify(params)}`);

    const audioHandlers = HandlerManager.getInstance().getHandlers(Audio);
    audioHandlers.forEach((h) =>
      (h.entities as Audio[]).forEach((audio: Audio) => {
        if (audio.id === id) {
          // eslint-disable-next-line no-param-reassign
          audio.playing = params.playing;
        }
      }),
    );
  }
}
