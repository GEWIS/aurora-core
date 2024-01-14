import BaseHandler from './base-handler';
import Audio from '../root/entities/audio';
import { MusicEmitter } from '../events';

export default abstract class BaseAudioHandler extends BaseHandler<Audio> {
  protected constructor(musicEmitter: MusicEmitter) {
    super();
    musicEmitter.registerAudioHandler(this);
  }

  protected setPlaying() {
    // eslint-disable-next-line no-param-reassign
    this.entities.forEach((a) => { a.playing = true; });
  }

  protected setNoLongerPlaying() {
    // eslint-disable-next-line no-param-reassign
    this.entities.forEach((a) => { a.playing = false; });
  }

  // Do nothing with incoming beats
  beat() {}
}
