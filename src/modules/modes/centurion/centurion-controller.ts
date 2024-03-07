import { Body, Get, Post, Res, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';
import { Controller, TsoaResponse } from '@tsoa/runtime';
import ModeManager from '../mode-manager';
import CenturionMode from './centurion-mode';
import { SecurityGroup } from '../../../helpers/security';
import MixTape, { HornData, SongData } from './tapes/mix-tape';
import tapes from './tapes';

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
export class CenturionController extends Controller {
  private modeManager: ModeManager;

  constructor() {
    super();
    this.modeManager = ModeManager.getInstance();
  }

  @Security('local', ['*'])
  @Get('')
  @Response<string>(411, 'Centurion not enabled')
  public getCenturion(@Res() notEnabledResponse: TsoaResponse<404, string>): CenturionResponse {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      return notEnabledResponse(404, 'Centurion not enabled');
    }

    return {
      name: mode.tape.name,
      startTime: mode.startTime,
      playing: mode.playing
    };
  }

  /**
   * Start a centurion
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('start')
  @SuccessResponse(204, 'Start commands sent')
  @Response<string>(411, 'Centurion not enabled')
  public startCenturion() {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Centurion not enabled';
    }

    if (!mode.start()) {
      this.setStatus(411);
      return 'Centurion not yet fully initialized. Please wait and try again later';
    }

    this.setStatus(204);
    return '';
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('skip')
  @SuccessResponse(204, 'Skip commands sent')
  @Response<string>(400, 'Invalid timestamp provided')
  @Response<string>(411, 'Centurion nog enabled')
  public skipCenturion(@Body() { seconds }: SkipCenturionRequest) {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Centurion not enabled';
    }

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
    SecurityGroup.BOARD
  ])
  @Post('stop')
  @SuccessResponse(204, 'Start commands sent')
  @Response<string>(411, 'Centurion not enabled')
  public stopCenturion() {
    const mode = this.modeManager.getMode(CenturionMode) as CenturionMode;
    if (mode === undefined) {
      this.setStatus(411);
      return 'Centurion not enabled';
    }

    mode.stop();
    this.setStatus(204);
    return '';
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Get('tapes')
  public getCenturionTapes(): MixTapeResponse[] {
    return tapes.map((t) => ({
      name: t.name,
      coverUrl: t.coverUrl,
      events: t.feed
        .filter((e) => ['horn', 'song'].includes(e.type))
        .map((e) => e as HornEvent | SongEvent),
      horns: t.feed.filter((e) => e.type === 'horn').length,
      duration: t.duration
    }));
  }
}
