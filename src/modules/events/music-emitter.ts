import { EventEmitter } from 'node:events';
// TODO: Fix cyclical dependency
// eslint-disable-next-line import/no-cycle
import BaseAudioHandler from '../handlers/base-audio-handler';

export class MusicEmitter extends EventEmitter {
  private audioHandlers: BaseAudioHandler[] = [];

  public registerAudioHandler(handler: BaseAudioHandler) {
    this.audioHandlers.push(handler);
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
    const someAudioPlaying = this.audioHandlers.some((h) => h.entities
      .some((a) => a.playing));
    if (someAudioPlaying) return;
    this.emit(eventName, ...args);
  }

  private forward(eventName: string, ...args: any[]) {
    this.emit(eventName, ...args);
  }
}
