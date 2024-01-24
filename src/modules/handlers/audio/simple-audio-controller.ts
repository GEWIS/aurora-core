import { Controller } from '@tsoa/runtime';
import {
  Body, Post, Route, Security, Tags,
} from 'tsoa';
import HandlerManager from '../../root/handler-manager';
import { Audio } from '../../root/entities';
import SimpleAudioHandler from './simple-audio-handler';
import { SecurityGroup } from '../../../helpers/security';

@Route('audio')
@Tags('Simple Audio')
export class SimpleAudioController extends Controller {
  private audioHandlers: SimpleAudioHandler[];

  constructor() {
    super();
    this.audioHandlers = HandlerManager.getInstance()
      .getHandlers(Audio)
      .filter((h) => h.constructor.name === SimpleAudioHandler.name) as SimpleAudioHandler[];
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('play')
  public async playAudio() {
    this.audioHandlers.forEach((handler) => handler.play());
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('stop')
  public async stopAudio() {
    this.audioHandlers.forEach((handler) => handler.stop());
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('skip')
  public async skipAudio(@Body() { seconds }: { seconds: number }) {
    this.audioHandlers.forEach((handler) => handler.setPlayback(seconds));
  }
}
