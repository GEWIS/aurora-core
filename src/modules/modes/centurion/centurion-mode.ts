import BaseMode from '../base-mode';
import { LightsGroup } from '../../lights/entities';
import { Audio, Screen } from '../../root/entities';
import SetEffectsHandler from '../../handlers/lights/set-effects-handler';
import SimpleAudioHandler from '../../handlers/audio/simple-audio-handler';
import MixTape, { FeedEvent, SongData } from './tapes/mix-tape';
import { BeatFadeOut, SearchLight } from '../../lights/effects';
import {
  getTwoComplementaryRgbColors, RgbColorSpecification,
} from '../../lights/color-definitions';
import { MusicEmitter } from '../../events';
import { TrackChangeEvent } from '../../events/music-emitter-events';
import { CenturionScreenHandler } from '../../handlers/screen/centurion-screen-handler';
import { LightsEffectBuilder } from '../../lights/effects/lights-effect';
import { Wave } from '../../lights/effects/wave';
import Sparkle from '../../lights/effects/sparkle';

const LIGHTS_HANDLER = 'SetEffectsHandler';
const AUDIO_HANDLER = 'SimpleAudioHandler';
const SCREEN_HANDLER = 'CenturionScreenHandler';
const STROBE_TIME = 1500; // Milliseconds

export default class CenturionMode extends BaseMode {
  private lightsHandler: SetEffectsHandler;

  private audioHandler: SimpleAudioHandler;

  private screenHandler: CenturionScreenHandler;

  private tape: MixTape;

  private musicEmitter: MusicEmitter;

  private feedEvents: {
    event: FeedEvent;
    timeouts: NodeJS.Timeout[];
  }[] = [];

  private timestamp: number = 0;

  private static instance: CenturionMode | undefined;

  private artificialBeatLoop: NodeJS.Timeout | undefined;

  private artificialBeatLoopStart: Date | undefined;

  private initialized = false;

  constructor(
    lights: LightsGroup[],
    screens: Screen[],
    audios: Audio[],
  ) {
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
    this.screenHandler = this.handlerManager.getHandlers(Screen)
      .find((h) => h.constructor.name === SCREEN_HANDLER) as CenturionScreenHandler;
  }

  public initialize(musicEmitter: MusicEmitter) {
    if (this.initialized) throw new Error('CenturionMode already initialized!');
    this.musicEmitter = musicEmitter;
  }

  public loadTape(tape: MixTape) {
    this.tape = tape;
    this.audioHandler.load(`/static${tape.songFile}`);
    this.screenHandler.loaded(tape);
  }

  public static getInstance() {
    return this.instance;
  }

  /**
   * Start playing the given mixtape and register all timed effects
   */
  public start(): boolean {
    if (!this.audioHandler.ready) return false;

    this.audioHandler.setPlayback(this.timestamp);
    this.audioHandler.play((startTime: number) => {
      // Synchronize music with effects
      const msDifference = new Date().getTime() - startTime;

      this.registerEvents(this.timestamp + (msDifference / 1000));

      this.artificialBeatLoopStart = new Date();
      this.artificialBeatLoop = setInterval(this.artificialBeat.bind(this), 500);
      this.artificialBeat();
      this.screenHandler.start();
    });
    return true;
  }

  /**
   * Continue playback at the given timestamp (in seconds)
   * @param seconds
   */
  public skip(seconds: number) {
    if (seconds < 0) throw new Error('Timestamp has to be positive');
    this.timestamp = seconds;
    // If we have registered events, we are playing audio
    if (this.feedEvents.length > 0) {
      this.audioHandler.setPlayback(seconds);
      this.registerEvents(seconds);
    }
  }

  /**
   * Stop playing the given mixtape and all its effects
   */
  public stop() {
    this.audioHandler.stop();
    this.screenHandler.stop();
    this.stopFeedEvents();

    clearInterval(this.artificialBeatLoop);
    this.artificialBeatLoop = undefined;
  }

  private emitSong(song: SongData | SongData[]) {
    let songs: SongData[];
    if (!Array.isArray(song)) {
      songs = [song];
    } else {
      songs = song;
    }

    this.musicEmitter.emitAudio('change_track', songs.map((s) => ({
      title: s.title,
      artists: s.artist.split(', '),
    })) as TrackChangeEvent[]);
  }

  private getRandomEffect(colors: RgbColorSpecification[]): LightsEffectBuilder {
    const effects = [{
      effect: BeatFadeOut.build(colors, false, true),
      probability: 0.8,
    }, {
      effect: Wave.build(colors[0]),
      probability: 0.1,
    }, {
      effect: Sparkle.build(colors),
      probability: 0.1,
    }];
    const factor = Math.random();
    return effects.find((effect, i) => {
      const previous = effects.slice(0, i).reduce((x, e) => x + e.probability, 0);
      return previous <= factor && previous + effect.probability > factor;
    })?.effect || BeatFadeOut.build(colors, false);
  }

  /**
   * Handle a fired event
   * @param event
   * @private
   */
  private handleFeedEvent(event: FeedEvent) {
    if (event.type === 'horn') {
      this.lights.forEach((l) => {
        l.pars.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadRgbs.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadWheels.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
      });
      this.screenHandler.horn(STROBE_TIME, event.data.counter);
    } else if (event.type === 'song') {
      const { colorNames, colorSpecs } = getTwoComplementaryRgbColors();

      const movingHeadEffect = SearchLight.build(1.5, 3000);
      const newEffectBuilder = this.getRandomEffect(colorSpecs);

      this.lights.forEach((l) => {
        this.lightsHandler.setEffect(l, [newEffectBuilder, movingHeadEffect]);
      });
      this.screenHandler.changeColors(colorNames);
      this.emitSong(event.data);
    } else if (event.type === 'effect') {
      this.lights.forEach((l) => {
        this.lightsHandler.setEffect(l, event.data.effects);
      });
    }
  }

  /**
   * Fire the last past event
   * @param seconds
   * @private
   */
  private fireLastFeedEvent(seconds: number) {
    const pastEvents = this.tape.feed
      .filter((e) => e.type === 'song' || e.type === 'effect')
      .filter((e) => e.timestamp <= seconds);
    if (pastEvents.length === 0) return;

    this.handleFeedEvent(pastEvents[pastEvents.length - 1]);
  }

  /**
   * Register events
   * @param seconds seconds since start of the track
   * @private
   */
  private registerEvents(seconds: number = 0): void {
    if (this.feedEvents.length > 0) {
      this.stopFeedEvents();
    }
    this.tape.feed
      .filter((e) => e.timestamp >= seconds)
      .forEach((event) => {
        const timestampMillis = Math.round((event.timestamp - seconds) * 1000);
        const timeouts = [setTimeout(this.handleFeedEvent.bind(this, event), timestampMillis)];

        this.feedEvents.push({
          event,
          timeouts,
        });
      });

    this.fireLastFeedEvent(seconds);
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
    this.stop();
    this.lights.forEach((lightsGroup) => {
      this.handlerManager.registerHandler(lightsGroup, '');
    });
    this.audios.forEach((audio) => {
      this.handlerManager.registerHandler(audio, '');
    });
    clearInterval(this.artificialBeatLoop);
  }

  private artificialBeat() {
    this.musicEmitter.emitAudio('beat', {
      beat: {
        start: new Date().getTime() - (this.artificialBeatLoopStart || new Date()).getTime(),
        duration: 0.8,
        confidence: 0.2,
      },
    });
  }
}
