import BaseMode from '../base-mode';
import { LightsGroup } from '../../lights/entities';
import { Audio, Screen } from '../../root/entities';
import SetEffectsHandler from '../../handlers/lights/set-effects-handler';
import SimpleAudioHandler from '../../handlers/audio/simple-audio-handler';
import MixTape, { FeedEvent } from './tapes/mix-tape';
import { BeatFadeOut } from '../../lights/effects';
import { rgbColors, wheelColors } from '../../lights/ColorDefinitions';
import Strobe from '../../lights/effects/strobe';

const LIGHTS_HANDLER = 'SetEffectsHandler';
const AUDIO_HANDLER = 'SimpleAudioHandler';
const STROBE_TIME = 1500; // Milliseconds

export default class CenturionMode extends BaseMode {
  private lightsHandler: SetEffectsHandler;

  private audioHandler: SimpleAudioHandler;

  private tape: MixTape;

  private feedEvents: {
    event: FeedEvent;
    timeouts: NodeJS.Timeout[];
  }[] = [];

  private static instance: CenturionMode | undefined;

  constructor(lights: LightsGroup[], screens: Screen[], audios: Audio[]) {
    super(lights, screens, audios);

    lights.forEach((lightsGroup) => {
      this.handlerManager.registerHandler(lightsGroup, LIGHTS_HANDLER);
    });
    audios.forEach((audio) => {
      this.handlerManager.registerHandler(audio, AUDIO_HANDLER);
    });

    this.lightsHandler = this.handlerManager.getHandlers(LightsGroup)
      .find((h) => h.constructor.name === LIGHTS_HANDLER) as SetEffectsHandler;
    this.audioHandler = this.handlerManager.getHandlers(Audio)
      .find((h) => h.constructor.name === AUDIO_HANDLER) as SimpleAudioHandler;
  }

  public loadTape(tape: MixTape) {
    this.tape = tape;
    this.audioHandler.load(`/static${tape.songFile}`);
  }

  public static getInstance() {
    return this.instance;
  }

  public start(): boolean {
    const timestamp = 40;

    if (!this.audioHandler.ready) return false;

    this.registerEvents(timestamp);
    this.audioHandler.play();
    this.audioHandler.setPlayback(timestamp);
    return true;
  }

  public stop() {
    this.audioHandler.stop();
    this.stopFeedEvents();
  }

  private handleFeedEvent(event: FeedEvent | 'resetStrobe') {
    const color = wheelColors[Math.floor(Math.random() * wheelColors.length)];
    const rgbColor = rgbColors[Math.floor(Math.random() * rgbColors.length)];

    if (event === 'resetStrobe') {
      this.lights.forEach((l) => {
        this.lightsHandler.removeEffect(l);
        l.pars.forEach((p) => p.fixture.blackout());
      });
    } else if (event.type === 'horn') {
      this.lights.forEach((l) => {
        l.pars.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadRgbs.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadWheels.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
      });
    // } else if (event.type === 'song') {
    //   this.lights.forEach((l) => {
    //     this.lightsHandler.setEffect(l, BeatFadeOut.build(color, rgbColor));
    //   });
    }
  }

  /**
   * Register events
   * @param timestamp seconds since start of the track
   * @private
   */
  private registerEvents(timestamp: number = 0): void {
    this.tape.feed
      .filter((e) => e.timestamp >= timestamp)
      .forEach((event) => {
        const timestampMillis = Math.round((event.timestamp - timestamp) * 1000);
        const timeouts = [setTimeout(this.handleFeedEvent.bind(this, event), timestampMillis)];
        if (event.type === 'horn') {
          timeouts.push(setTimeout(this.handleFeedEvent.bind(this, 'resetStrobe'), timestampMillis + 2000));
        }

        this.feedEvents.push({
          event,
          timeouts,
        });
      });
  }

  private stopFeedEvents() {
    this.feedEvents.forEach((e): void => {
      e.timeouts.forEach((t) => clearTimeout(t));
    });
    this.feedEvents = [];
  }

  /**
   * Remove all handlers from these entities
   */
  public destroy() {
    this.lights.forEach((lightsGroup) => {
      this.handlerManager.registerHandler(lightsGroup, '');
    });
    this.audios.forEach((audio) => {
      this.handlerManager.registerHandler(audio, '');
    });
  }
}
