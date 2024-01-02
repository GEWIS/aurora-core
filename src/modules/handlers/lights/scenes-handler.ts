import BaseLightsHandler from '../base-lights-handler';
import { BeatEvent } from '../../events/music-emitter-events';
import { LightsGroup } from '../../lights/entities';

export class ScenesHandler extends BaseLightsHandler {
  beat(): void {}

  tick(): LightsGroup[] {
    return [];
  }
}
