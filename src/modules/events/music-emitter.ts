import { EventEmitter } from 'node:events';
import HandlerManager from '../root/handler-manager';
import { Audio } from '../root/entities';
import BaseAudioHandler from '../handlers/base-audio-handler';
import { BeatEvent, TrackChangeEvent } from './music-emitter-events';

export class MusicEmitter extends EventEmitter {
  constructor(private handlerManager: HandlerManager) {
    super();
    this.on('beat', this.handleBeat.bind(this));
    this.on('change_track', this.handleChangeTrack.bind(this));
  }

  /**
   * Emit Spotify-related events. Blocked when an audio entity is playing audio
   * @param eventName
   * @param args
   */
  public emitSpotify(eventName: string, ...args: any[]) {
    this.forwardOnAudioNotPlaying(eventName, ...args);
  }

  /**
   * Emit general audio events. Never blocked
   * @param eventName
   * @param args
   */
  public emitAudio(eventName: string, ...args: any[]) {
    this.forward(eventName, ...args);
  }

  /**
   * Emit the given event when no audio device is playing any audio
   * @param eventName
   * @param args
   * @private
   */
  private forwardOnAudioNotPlaying(eventName: string, ...args: any[]) {
    const handlers = this.handlerManager.getHandlers(Audio) as BaseAudioHandler[];
    if (handlers.some((handler) => handler.entities
      .some((audio) => audio.playing))) return;

    this.emit(eventName, ...args);
  }

  private forward(eventName: string, ...args: any[]) {
    this.emit(eventName, ...args);
  }

  private handleBeat(event: BeatEvent) {
    this.handlerManager.beat(event);
  }

  private handleChangeTrack(event: TrackChangeEvent[]) {
    this.handlerManager.changeTrack(event);
  }
}
