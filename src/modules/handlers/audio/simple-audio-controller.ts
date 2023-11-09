import { Controller } from '@tsoa/runtime';
import {
  Body, Post, Route, Tags,
} from 'tsoa';
import HandlerManager from '../../root/handler-manager';
import { Audio } from '../../root/entities';
import SimpleAudioHandler from './simple-audio-handler';

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

  @Post('play')
  public async playAudio() {
    this.audioHandlers.forEach((handler) => handler.play());
  }

  @Post('stop')
  public async stopAudio() {
    this.audioHandlers.forEach((handler) => handler.stop());
  }

  @Post('skip')
  public async skipAudio(@Body() { seconds }: { seconds: number }) {
    this.audioHandlers.forEach((handler) => handler.setPlayback(seconds));
  }
}
