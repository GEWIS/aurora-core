import BaseLightsHandler from '../handlers/base-lights-handler';
import { Server } from 'socket.io';
import { MusicEmitter } from '../events';
import { RandomEffectsHandler } from '../handlers/lights';
import SetEffectsHandler from '../handlers/lights/set-effects-handler';
import DevelopEffectsHandler from '../handlers/lights/develop-effects-handler';
import { ScenesHandler } from '../handlers/lights/scenes-handler';
import EffectSequenceHandler from '../handlers/lights/effect-sequence-handler';
import TimeTrailRaceLightsHandler from '../handlers/lights/time-trail-race-lights-handler';
import { BaseHandler } from '@gewis/aurora-core-util';
import BaseAudioHandler from '../handlers/base-audio-handler';
import SimpleAudioHandler from '../handlers/audio/simple-audio-handler';
import { SocketioNamespaces } from '@gewis/aurora-core-util';
import BaseScreenHandler from '../handlers/base-screen-handler';
import {
  CenturionScreenHandler,
  CurrentlyPlayingTrackHandler,
  GewisPosterScreenHandler,
  HubbleClosedPosterScreenHandler,
  HubbleLastcallPosterScreenHandler,
  HubblePosterScreenHandler,
  RoomResponsibleLegacyHandler,
  StageEffectsHandler,
  StaticPosterHandler,
  TimeTrailRaceScreenHandler,
} from '../handlers/screen';

/**
 * Object to create the set of all handlers belonging to each listener
 */
export default class HandlerFactory {
  constructor(
    private io: Server,
    private musicEmitter: MusicEmitter,
  ) {}

  /**
   * Creates the handler if the handler is enabled
   * @param creator
   * @private
   */
  private createHandler<T extends BaseHandler<any>>(creator: () => T): T | null {
    return creator();
  }

  public createAudioHandlers(): BaseAudioHandler[] {
    const audioHandlers: (BaseAudioHandler | null)[] = [
      this.createHandler(() => new SimpleAudioHandler(this.io.of(SocketioNamespaces.AUDIO), this.musicEmitter)),
    ];
    return audioHandlers.filter((h) => h != null);
  }

  public createLightHandlers(): BaseLightsHandler[] {
    // Create all light handlers
    const lightsHandlers: (BaseLightsHandler | null)[] = [
      this.createHandler(() => new RandomEffectsHandler()),
      this.createHandler(() => new SetEffectsHandler()),
      this.createHandler(() => new DevelopEffectsHandler()),
      this.createHandler(() => new ScenesHandler()),
      this.createHandler(() => new EffectSequenceHandler(this.musicEmitter)),
      this.createHandler(() => new TimeTrailRaceLightsHandler()),
    ];
    return lightsHandlers.filter((h) => h != null);
  }

  public createScreenHandlers(): BaseScreenHandler[] {
    const socket = this.io.of(SocketioNamespaces.SCREEN);
    const screenHandlers: (BaseScreenHandler | null)[] = [
      this.createHandler(() => new CurrentlyPlayingTrackHandler(socket)),
      this.createHandler(() => new CenturionScreenHandler(socket)),
      this.createHandler(() => new GewisPosterScreenHandler(socket)),
      this.createHandler(() => new HubblePosterScreenHandler(socket)),
      this.createHandler(() => new HubbleClosedPosterScreenHandler(socket)),
      this.createHandler(() => new HubbleLastcallPosterScreenHandler(socket)),
      this.createHandler(() => new StageEffectsHandler(socket)),
      this.createHandler(() => new StaticPosterHandler(socket)),
      this.createHandler(() => new TimeTrailRaceScreenHandler(socket)),
      this.createHandler(() => new RoomResponsibleLegacyHandler(socket)),
    ];
    return screenHandlers.filter((h) => h != null);
  }
}
