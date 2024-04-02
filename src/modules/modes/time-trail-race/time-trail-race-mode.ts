import crypto from 'crypto';
import BaseMode from '../base-mode';
import SimpleAudioHandler from '../../handlers/audio/simple-audio-handler';
import TimeTrailRaceScreenHandler from '../../handlers/screen/time-trail-race-screen-handler';
import { LightsGroup } from '../../lights/entities';
import { Audio, Screen } from '../../root/entities';
import { TimeTrailRaceState } from './time-trail-race-state';
import { BackofficeSyncEmitter } from '../../events/backoffice-sync-emitter';
import { PlayerParams, RegisterPlayerParams, ScoreboardItem } from './time-trail-race-entities';
import {
  RaceFinishedEvent,
  RaceInitializedEvent,
  RacePlayerReadyEvent,
  RacePlayerRegisteredEvent,
  RaceScoreboardEvent,
  RaceStartedEvent,
} from './time-trail-race-events';
import { InvalidStateError } from './time-trail-race-invalid-state-error';
import TimeTrailRaceLightsHandler from '../../handlers/lights/time-trail-race-lights-handler';
import { ArtificialBeatGenerator } from '../../beats/artificial-beat-generator';
import logger from '../../../logger';

const LIGHTS_HANDLER = 'TimeTrailRaceLightsHandler';
const AUDIO_HANDLER = 'SimpleAudioHandler';
const SCREEN_HANDLER = 'TimeTrailRaceScreenHandler';

const MUSIC_FILE = '/static/audio/benny-hill-theme.mp3';

export default class TimeTrailRaceMode extends BaseMode {
  private lightsHandler: TimeTrailRaceLightsHandler;

  private audioHandler: SimpleAudioHandler;

  private screenHandler: TimeTrailRaceScreenHandler;

  private artificialBeatGenerator: ArtificialBeatGenerator;

  private backofficeSyncEmitter: BackofficeSyncEmitter;

  private _sessionName: string;

  private _state: TimeTrailRaceState;

  public playerParams: PlayerParams;

  private startTime: Date | undefined;

  private lastScore: ScoreboardItem | undefined;

  public scoreboard: ScoreboardItem[] = [];

  destroy(): void {
    throw new Error('Method not implemented.');
  }

  constructor(lights: LightsGroup[], screens: Screen[], audios: Audio[]) {
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

    this.lightsHandler = this.handlerManager
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === LIGHTS_HANDLER) as TimeTrailRaceLightsHandler;
    this.audioHandler = this.handlerManager
      .getHandlers(Audio)
      .find((h) => h.constructor.name === AUDIO_HANDLER) as SimpleAudioHandler;
    this.screenHandler = this.handlerManager
      .getHandlers(Screen)
      .find((h) => h.constructor.name === SCREEN_HANDLER) as TimeTrailRaceScreenHandler;

    this.artificialBeatGenerator = ArtificialBeatGenerator.getInstance();
  }

  public get state() {
    return this._state;
  }

  public get sessionName() {
    return this._sessionName;
  }

  public initialize(backofficeSyncEmitter: BackofficeSyncEmitter, sessionName: string) {
    this.backofficeSyncEmitter = backofficeSyncEmitter;
    this._sessionName = sessionName;
    this._state = TimeTrailRaceState.INITIALIZED;

    const event: RaceInitializedEvent = {
      state: this._state,
      sessionName,
    };
    this.screenHandler.initialized(event);
    this.backofficeSyncEmitter.emit('race-initialize', event);

    this.lightsHandler.setLightsToParty();

    logger.trace(`Time Trail Race initialized (${sessionName})`);

    return event;
  }

  /**
   * Register the player that will participate next in a time trail
   * @param params
   */
  public registerPlayer(params: RegisterPlayerParams) {
    if (
      this._state !== TimeTrailRaceState.INITIALIZED &&
      this._state !== TimeTrailRaceState.SCOREBOARD
    ) {
      throw new InvalidStateError('Time Trail Race not in INITIALIZED or SCOREBOARD state');
    }

    this.playerParams = {
      ...params,
      uuid: crypto.randomUUID(),
    };
    this._state = TimeTrailRaceState.PLAYER_REGISTERED;

    const event: RacePlayerRegisteredEvent = {
      state: this._state,
      sessionName: this._sessionName,
      player: this.playerParams,
      scoreboard: this.scoreboard,
    };
    this.screenHandler.playerRegistered(event);
    this.backofficeSyncEmitter.emit('race-player-registered', event);

    logger.trace(`Time Trail Race player "${params.name}" registered`);

    return event;
  }

  /**
   * Player is ready to start
   */
  public ready() {
    if (this._state !== TimeTrailRaceState.PLAYER_REGISTERED) {
      throw new InvalidStateError('Time Trail Race not in PLAYER_REGISTERED state');
    }

    this._state = TimeTrailRaceState.PLAYER_READY;

    const event: RacePlayerReadyEvent = {
      state: this._state,
      sessionName: this._sessionName,
      player: this.playerParams,
    };
    this.screenHandler.playerReady(event);
    this.backofficeSyncEmitter.emit('race-player-ready', event);

    this.lightsHandler.setLightsToWhite();

    logger.trace('Time Trail Race player ready');

    return event;
  }

  /**
   * Player starts the time trail race
   */
  public start() {
    if (this._state !== TimeTrailRaceState.PLAYER_READY) {
      throw new InvalidStateError('Time Trail Race not in PLAYER_READY state');
    }

    this.startTime = new Date();
    this._state = TimeTrailRaceState.STARTED;

    const event: RaceStartedEvent = {
      state: this._state,
      sessionName: this._sessionName,
      startTime: this.startTime,
      player: this.playerParams,
    };
    this.screenHandler.started(event);
    this.backofficeSyncEmitter.emit('race-start', event);
    this.audioHandler.play(MUSIC_FILE);

    this.lightsHandler.setLightsToParty();
    this.artificialBeatGenerator.start(125);

    logger.trace(`Time trail race player started at ${this.startTime.toLocaleTimeString()}`);

    return event;
  }

  /**
   * Player finishes the time trail race
   * @returns boolean whether precondition is met and thus moved to new state
   */
  public finish() {
    if (this._state !== TimeTrailRaceState.STARTED || !this.startTime) {
      throw new InvalidStateError('Time Trail Race not in STARTED state');
    }

    const finishTime = new Date().getTime() - this.startTime.getTime();
    this.lastScore = {
      ...this.playerParams,
      timeMs: finishTime,
    };
    this.scoreboard.push(this.lastScore);
    this.scoreboard.sort((a, b) => a.timeMs - b.timeMs);

    this._state = TimeTrailRaceState.FINISHED;

    const event: RaceFinishedEvent = {
      state: this._state,
      sessionName: this._sessionName,
      player: this.lastScore,
      scoreboard: this.scoreboard,
    };
    this.screenHandler.finished(event);
    this.backofficeSyncEmitter.emit('race-finish', event);
    this.audioHandler.stop();

    this.lightsHandler.setLightsToWhite();
    this.artificialBeatGenerator.stop();

    logger.trace(`Time Trail Race player finished with ${finishTime.toLocaleString()}ms`);

    return event;
  }

  /**
   * Player's score is revealed and new player can be registered
   */
  public revealScore() {
    if (this._state !== TimeTrailRaceState.FINISHED || !this.lastScore) {
      throw new InvalidStateError('Time Trail Race not in FINISHED state');
    }

    this._state = TimeTrailRaceState.SCOREBOARD;
    const event: RaceScoreboardEvent = {
      state: this._state,
      sessionName: this._sessionName,
      player: this.lastScore,
      scoreboard: this.scoreboard,
    };
    this.screenHandler.showScoreboard(event);
    this.backofficeSyncEmitter.emit('race-scoreboard', event);

    this.lightsHandler.setLightsToParty();

    logger.trace('Time Trail Race score revealed');

    return event;
  }
}
