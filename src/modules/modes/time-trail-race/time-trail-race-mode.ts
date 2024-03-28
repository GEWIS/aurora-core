import crypto from 'crypto';
import BaseMode from '../base-mode';
import SetEffectsHandler from '../../handlers/lights/set-effects-handler';
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

const LIGHTS_HANDLER = 'SetEffectsHandler';
const AUDIO_HANDLER = 'SimpleAudioHandler';
const SCREEN_HANDLER = 'TimeTrailRaceScreenHandler';

export default class TimeTrailRaceMode extends BaseMode {
  private lightsHandler: SetEffectsHandler;

  private audioHandler: SimpleAudioHandler;

  private screenHandler: TimeTrailRaceScreenHandler;

  private backofficeSyncEmitter: BackofficeSyncEmitter;

  private sessionName: string;

  private _state: TimeTrailRaceState;

  public playerParams: PlayerParams;

  private startTime: Date | undefined;

  private lastScore: ScoreboardItem | undefined;

  private scoreboard: ScoreboardItem[] = [];

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
      .find((h) => h.constructor.name === LIGHTS_HANDLER) as SetEffectsHandler;
    this.audioHandler = this.handlerManager
      .getHandlers(Audio)
      .find((h) => h.constructor.name === AUDIO_HANDLER) as SimpleAudioHandler;
    this.screenHandler = this.handlerManager
      .getHandlers(Screen)
      .find((h) => h.constructor.name === SCREEN_HANDLER) as TimeTrailRaceScreenHandler;
  }

  public get state() {
    return this._state;
  }

  public initialize(backofficeSyncEmitter: BackofficeSyncEmitter, sessionName: string) {
    this.backofficeSyncEmitter = backofficeSyncEmitter;
    this.sessionName = sessionName;
    this._state = TimeTrailRaceState.INITIALIZED;

    const event: RaceInitializedEvent = {
      sessionName,
    };
    this.screenHandler.initialized(event);
    this.backofficeSyncEmitter.emit('race-initialize', event);
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
      return false;
    }

    this.playerParams = {
      ...params,
      uuid: crypto.randomUUID(),
    };
    this._state = TimeTrailRaceState.PLAYER_REGISTERED;

    const event: RacePlayerRegisteredEvent = {
      state: this._state,
      sessionName: this.sessionName,
      playerName: params.name,
      scoreboard: this.scoreboard,
    };
    this.screenHandler.playerRegistered(event);
    this.backofficeSyncEmitter.emit('race-player-registered', event);

    return true;
  }

  /**
   * Player is ready to start
   */
  public ready() {
    if (this._state !== TimeTrailRaceState.PLAYER_REGISTERED) {
      return false;
    }

    this._state = TimeTrailRaceState.PLAYER_READY;

    const event: RacePlayerReadyEvent = {
      state: this._state,
      sessionName: this.sessionName,
      name: this.playerParams.name,
    };
    this.screenHandler.playerReady(event);
    this.backofficeSyncEmitter.emit('race-player-ready', event);

    return true;
  }

  /**
   * Player starts the time trail race
   */
  public start() {
    if (this._state !== TimeTrailRaceState.PLAYER_READY) {
      return false;
    }

    this.startTime = new Date();
    this._state = TimeTrailRaceState.STARTED;

    const event: RaceStartedEvent = {
      state: this._state,
      sessionName: this.sessionName,
      startTime: this.startTime,
      name: this.playerParams.name,
    };
    this.screenHandler.started(event);
    this.backofficeSyncEmitter.emit('race-start', event);
    this.audioHandler.play('');

    return true;
  }

  /**
   * Player finishes the time trail race
   * @returns boolean whether precondition is met and thus moved to new state
   */
  public finish() {
    if (this._state !== TimeTrailRaceState.STARTED || !this.startTime) {
      return false;
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
      sessionName: this.sessionName,
      name: this.playerParams.name,
      timeMs: finishTime,
    };
    this.screenHandler.finished(event);
    this.backofficeSyncEmitter.emit('race-finish', event);
    this.audioHandler.stop();

    return true;
  }

  /**
   * Player's score is revealed and new player can be registered
   */
  public revealScore() {
    if (this._state !== TimeTrailRaceState.FINISHED) {
      return false;
    }

    this._state = TimeTrailRaceState.SCOREBOARD;
    const event: RaceScoreboardEvent = {
      state: this._state,
      sessionName: this.sessionName,
      name: this.lastScore?.name || '',
      timeMs: this.lastScore?.timeMs || 0,
      scoreboard: this.scoreboard,
    };
    this.screenHandler.showScoreboard(event);
    this.backofficeSyncEmitter.emit('race-scoreboard', event);

    return true;
  }
}
