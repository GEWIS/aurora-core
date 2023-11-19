import BaseScreenHandler from '../base-screen-handler';
import { BeatEvent, TrackChangeEvent } from '../../events/music-emitter-events';
import MixTape from '../../modes/centurion/tapes/mix-tape';
import { RgbColor } from '../../lights/color-definitions';

export class CenturionScreenHandler extends BaseScreenHandler {
  beat(event: BeatEvent): void {
    this.socket.emit('beat', event);
  }

  changeTrack(event: TrackChangeEvent[]): void {
    this.socket.emit('change_track', event);
  }

  changeColors(colors: RgbColor[]): void {
    this.socket.emit('change_colors', colors);
  }

  horn(strobeTime: number, counter: number): void {
    this.socket.emit('horn', { strobeTime, counter });
  }

  loaded(tape: MixTape): void {
    this.socket.emit('loaded', tape);
  }

  start(): void {
    this.socket.emit('start');
  }

  stop(): void {
    this.socket.emit('stop');
  }
}
