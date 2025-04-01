import { BaseHandler } from '@gewis/aurora-core-util';
import Audio from './audio';
import { MusicEmitter } from './music-emitter';

export abstract class BaseAudioHandler extends BaseHandler<Audio> {
  protected constructor(musicEmitter: MusicEmitter) {
    super();
    musicEmitter.registerAudioHandler(this);
  }

  // Do nothing with incoming beats
  beat() {}
}
