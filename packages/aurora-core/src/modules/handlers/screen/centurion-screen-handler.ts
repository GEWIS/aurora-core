import { BeatEvent, TrackChangeEvent } from '@gewis/aurora-core-audio-handler';
import MixTape from '../../modes/centurion/tapes/mix-tape';
import { RgbColor } from '../../lights/color-definitions';
import { BaseScreenHandler } from '@gewis/aurora-core-screen';

export default class CenturionScreenHandler extends BaseScreenHandler {
  beat(event: BeatEvent): void {
    this.sendEvent('beat', event);
  }

  changeTrack(event: TrackChangeEvent[]): void {
    this.sendEvent('change_track', event);
  }

  changeColors(colors: RgbColor[]): void {
    this.sendEvent('change_colors', colors);
  }

  horn(strobeTime: number, counter: number): void {
    this.sendEvent('horn', { strobeTime, counter });
  }

  loaded(tape: MixTape): void {
    this.sendEvent('loaded', tape);
  }

  start(): void {
    this.sendEvent('start');
  }

  stop(): void {
    this.sendEvent('stop');
  }
}
