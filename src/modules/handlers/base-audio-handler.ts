import BaseHandler from './base-handler';
import Audio from '../root/entities/audio';

export default abstract class BaseAudioHandler extends BaseHandler<Audio> {
  // Do nothing with incoming beats
  beat() {}
}
