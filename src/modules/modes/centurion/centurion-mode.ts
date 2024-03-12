import BaseMode from '../base-mode';
import { LightsGroup } from '../../lights/entities';
import { Audio, Screen } from '../../root/entities';
import SetEffectsHandler from '../../handlers/lights/set-effects-handler';
import SimpleAudioHandler from '../../handlers/audio/simple-audio-handler';
import MixTape, { FeedEvent, SongData } from './tapes/mix-tape';
import { BeatFadeOut, StaticColor } from '../../lights/effects/color';
import { SearchLight } from '../../lights/effects/movement';
import {
  getTwoComplementaryRgbColors, RgbColor,
} from '../../lights/color-definitions';
import { MusicEmitter } from '../../events';
import { TrackChangeEvent } from '../../events/music-emitter-events';
import { CenturionScreenHandler } from '../../handlers/screen';
import { LightsEffectBuilder } from '../../lights/effects/lights-effect';
import Wave from '../../lights/effects/color/wave';
import Sparkle from '../../lights/effects/color/sparkle';
import { ArtificialBeatGenerator } from '../../beats/artificial-beat-generator';
import logger from '../../../logger';

const LIGHTS_HANDLER = 'SetEffectsHandler';
const AUDIO_HANDLER = 'SimpleAudioHandler';
const SCREEN_HANDLER = 'CenturionScreenHandler';
const STROBE_TIME = 1500; // Milliseconds

export default class CenturionMode extends BaseMode {
  private lightsHandler: SetEffectsHandler;

  private audioHandler: SimpleAudioHandler;

  private screenHandler: CenturionScreenHandler;

  public tape: MixTape;

  private musicEmitter: MusicEmitter;

  private feedEvents: {
    event: FeedEvent;
    timeouts: NodeJS.Timeout[];
  }[] = [];

  private timestamp: number = 0;

  public startTime: Date = new Date();

  private static instance: CenturionMode | undefined;

  private beatGenerator: ArtificialBeatGenerator;

  private initialized = false;

  public get playing(): boolean {
    // If we have registered events, we are playing audio
    return this.feedEvents.length > 0;
  }

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
    screens.forEach((screen) => {
      this.handlerManager.registerHandler(screen, SCREEN_HANDLER);
    });

    this.lightsHandler = this.handlerManager.getHandlers(LightsGroup)
      .find((h) => h.constructor.name === LIGHTS_HANDLER) as SetEffectsHandler;
    this.audioHandler = this.handlerManager.getHandlers(Audio)
      .find((h) => h.constructor.name === AUDIO_HANDLER) as SimpleAudioHandler;
    this.screenHandler = this.handlerManager.getHandlers(Screen)
      .find((h) => h.constructor.name === SCREEN_HANDLER) as CenturionScreenHandler;

    this.audioHandler.addSyncAudioTimingHandler(this.syncFeedEvents.bind(this));

    this.beatGenerator = ArtificialBeatGenerator.getInstance();
  }

  public initialize(musicEmitter: MusicEmitter) {
    if (this.initialized) throw new Error('CenturionMode already initialized!');
    this.musicEmitter = musicEmitter;
  }

  public loadTape(tape: MixTape) {
    this.tape = tape;
    this.screenHandler.loaded(tape);
    logger.info(`Initialized centurion tape "${tape.name}"`);
  }

  public static getInstance() {
    return this.instance;
  }

  /**
   * Start playing the given mixtape and register all timed effects
   */
  public start(): boolean {
    if (this.tape.songFile.startsWith('http')) {
      this.audioHandler.play(this.tape.songFile, this.timestamp);
    } else {
      this.audioHandler.play(`/static${this.tape.songFile}`, this.timestamp);
    }

    this.registerFeedEvents(this.timestamp);
    this.fireLastFeedEvent(this.timestamp);

    this.screenHandler.start();
    this.beatGenerator.start(130);
    logger.info('Started centurion playback.');
    return true;
  }

  /**
   * Continue playback at the given timestamp (in seconds)
   * @param seconds
   */
  public skip(seconds: number) {
    if (seconds < 0) throw new Error('Timestamp has to be positive');
    this.timestamp = seconds;
    this.audioHandler.setPlayback(seconds);

    if (this.playing) {
      this.registerFeedEvents(seconds);
      this.fireLastFeedEvent(seconds);
    }
    logger.info(`Moved centurion playback to ${seconds} seconds.`);
  }

  /**
   * Stop playing the given mixtape and all its effects
   */
  public stop() {
    this.audioHandler.stop();
    this.screenHandler.stop();
    this.stopFeedEvents();
    this.beatGenerator.stop();
    logger.info('Paused centurion playback.');

    this.timestamp = (new Date().getTime() - this.startTime.getTime()) / 1000;
  }

  private emitSong(song: SongData | SongData[]) {
    let songs: SongData[];
    if (!Array.isArray(song)) {
      songs = [song];
    } else {
      songs = song;
    }

    this.beatGenerator.start(songs[0].bpm ?? 130);

    this.musicEmitter.emitAudio('change_track', songs.map((s) => ({
      title: s.title,
      artists: s.artist.split(', '),
      cover: this.tape.coverUrl,
    })) as TrackChangeEvent[]);
  }

  private getRandomEffect(colors: RgbColor[]): LightsEffectBuilder {
    const effects = [{
      effect: BeatFadeOut.build({ colors, enableFade: false, nrBlacks: 1 }),
      probability: 0.8,
    }, {
      effect: Wave.build({ color: colors[0] }),
      probability: 0.1,
    }, {
      effect: Sparkle.build({ colors }),
      probability: 0.1,
    }];
    const factor = Math.random();
    return effects.find((effect, i) => {
      const previous = effects.slice(0, i).reduce((x, e) => x + e.probability, 0);
      return previous <= factor && previous + effect.probability > factor;
    })?.effect || BeatFadeOut.build({ colors, enableFade: false });
  }

  /**
   * Handle a fired event
   * @param event
   * @private
   */
  private handleFeedEvent(event: FeedEvent) {
    logger.debug(event);

    if (event.type === 'horn') {
      this.lights.forEach((l) => {
        l.pars.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadRgbs.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
        l.movingHeadWheels.forEach((p) => p.fixture.enableStrobe(STROBE_TIME));
      });
      this.screenHandler.horn(STROBE_TIME, event.data.counter);
    } else if (event.type === 'song') {
      const { colorNames } = getTwoComplementaryRgbColors();

      const movingHeadEffectMovement = SearchLight.build({ radiusFactor: 1.5, cycleTime: 3000 });
      const movingHeadEffectColor = StaticColor.build({ color: RgbColor.WHITE });
      const newEffectBuilder = this.getRandomEffect(colorNames);

      this.lights.forEach((l) => {
        // If we have a moving head, assign a movement effect
        if (l.movingHeadRgbs.length > 0 || l.movingHeadWheels.length > 0) {
          this.lightsHandler.setMovementEffect(l, [movingHeadEffectMovement]);
        }
        // If we have a wheel moving head, assign a static color
        if (l.movingHeadWheels.length > 0) {
          this.lightsHandler.setColorEffect(l, [movingHeadEffectColor]);
        // Otherwise use a random effect!
        } else {
          this.lightsHandler.setColorEffect(l, [newEffectBuilder]);
        }
      });
      this.screenHandler.changeColors(colorNames);
      this.emitSong(event.data);
    } else if (event.type === 'effect') {
      this.lights.forEach((l) => {
        this.lightsHandler.setColorEffect(l, event.data.effects);
      });
    } else if (event.type === 'other' && event.data === 'stop') {
      this.stop();
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
  private registerFeedEvents(seconds: number = 0): void {
    if (this.feedEvents.length > 0) {
      this.stopFeedEvents();
    }

    this.startTime = new Date(new Date().getTime() - (seconds * 1000));

    const stopEvent: FeedEvent = {
      type: 'other',
      data: 'stop',
      timestamp: this.tape.duration,
    };

    [...this.tape.feed, stopEvent]
      .filter((e) => e.timestamp >= seconds)
      .forEach((event) => {
        const timestampMillis = Math.round((event.timestamp - seconds) * 1000);
        const timeouts = [setTimeout(this.handleFeedEvent.bind(this, event), timestampMillis)];

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
   * Synchronize the feed events with the currently playing audio
   * @param sendTime the time the sync packet has been sent (to synchronize clocks)
   * in ms since epoch
   * @param timestamp progression of the audio in ms
   * @private
   */
  private syncFeedEvents({ startTime, timestamp }: { startTime: number, timestamp: number }) {
    const msDifference = new Date().getTime() - startTime;

    this.registerFeedEvents((timestamp + msDifference) / 1000);
  }

  /**
   * Remove all handlers from these entities
   */
  public destroy() {
    this.stop();
    this.audioHandler.removeSyncAudioTimingHandler(this.syncFeedEvents.bind(this));
    this.lights.forEach((lightsGroup) => {
      this.handlerManager.registerHandler(lightsGroup, '');
    });
    this.audios.forEach((audio) => {
      this.handlerManager.registerHandler(audio, '');
    });
  }
}
