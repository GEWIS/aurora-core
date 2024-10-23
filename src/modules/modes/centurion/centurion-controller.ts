import { Body, Get, Post, Request, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';
import { Controller, Middlewares } from '@tsoa/runtime';
import {
  NextFunction,
  Request as ExRequest,
  Request as ExpressRequest,
  Response as ExResponse,
} from 'express';
import ModeManager from '../mode-manager';
import CenturionMode from './centurion-mode';
import { SecurityGroup } from '../../../helpers/security';
import MixTape, { HornData, SongData } from './tapes/mix-tape';
import tapes from './tapes';
import ModeDisabledError from '../mode-disabled-error';
import logger from '../../../logger';
import { FeatureEnabled } from '../../server-settings';
import ServerSettingsStore from '../../server-settings/server-settings-store';

interface SkipCenturionRequest {
  /**
   * @minimum 0 Timestamp should be positive
   */
  seconds: number;
}

interface CenturionResponse {
  name: string;
  startTime: Date;
  playing: boolean;
}

interface HornEvent {
  type: 'horn';
  timestamp: number;
  data: HornData;
}

interface SongEvent {
  type: 'song';
  timestamp: number;
  data: SongData | SongData[];
}

interface MixTapeResponse extends Pick<MixTape, 'name' | 'coverUrl'> {
  events: (HornEvent | SongEvent)[];
  /** Amount of horns */
  horns: number;
  /** Duration of the mix tape */
  duration: number;
}

@Route('modes/centurion')
@Tags('Modes')
@FeatureEnabled('CenturionEnabled')
export class CenturionController extends Controller {
  private modeManager: ModeManager;

  constructor() {
    super();
    this.modeManager = ModeManager.getInstance();
  }

  @Security('local', ['*'])
  @Get('')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public getCenturion(): CenturionResponse | null {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      this.setStatus(204);
      return null;
    }

    return {
      name: mode.tape.name,
      startTime: mode.startTime,
      playing: mode.playing,
    };
  }

  /**
   * Start a centurion
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Post('start')
  @SuccessResponse(204, 'Start commands sent')
  @Response<ModeDisabledError>(404, 'Centurion not enabled')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  @Response<string>(428, 'Centurion not yet fully initialized. Please wait and try again later')
  public startCenturion(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      throw new ModeDisabledError('Centurion not enabled');
    }

    logger.audit(req.user, 'Start Centurion.');

    if (!mode.start()) {
      this.setStatus(428);
      return 'Centurion not yet fully initialized. Please wait and try again later';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Post('skip')
  @SuccessResponse(204, 'Skip commands sent')
  @Response<string>(400, 'Invalid timestamp provided')
  @Response<ModeDisabledError>(404, 'Centurion not enabled')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public skipCenturion(@Request() req: ExpressRequest, @Body() body: SkipCenturionRequest) {
    const { seconds } = body;
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      throw new ModeDisabledError('Centurion not enabled');
    }

    logger.audit(req.user, `Skip Centurion to "${seconds}" seconds.`);

    mode.skip(seconds);

    this.setStatus(204);
    return '';
  }

  /**
   * Stop a centurion
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Post('stop')
  @SuccessResponse(204, 'Start commands sent')
  @Response<ModeDisabledError>(404, 'Centurion not enabled')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public stopCenturion(@Request() req: ExpressRequest) {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      throw new ModeDisabledError('Centurion not enabled');
    }

    logger.audit(req.user, 'Stop Centurion.');

    mode.stop();
    this.setStatus(204);
    return '';
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Get('tapes')
  @Response<string>(409, 'Endpoint is disabled in the server settings')
  public getCenturionTapes(): MixTapeResponse[] {
    return tapes.map((t) => ({
      name: t.name,
      coverUrl: t.coverUrl,
      events: t.feed
        .filter((e) => ['horn', 'song'].includes(e.type))
        .map((e) => e as HornEvent | SongEvent),
      horns: t.feed.filter((e) => e.type === 'horn').length,
      duration: t.duration,
    }));
  }
}
