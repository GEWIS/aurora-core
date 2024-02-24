import {
  Body, Get, Post, Response, Route, Security, SuccessResponse, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import ModeManager from '../mode-manager';
import CenturionMode from './centurion-mode';
import { SecurityGroup } from '../../../helpers/security';
import MixTape, { Song, SongData } from './tapes/mix-tape';
import tapes from './tapes';

interface SkipCenturionRequest {
  /**
   * @minimum 0 Timestamp should be positive
   */
  seconds: number;
}

interface CenturionResponse {
  name: string;
  tape: string;
  startTime: Date;
}

interface MixTapeResponse extends Pick<MixTape, 'name' | 'coverUrl'> {
  songs: SongData[];
  /** Seconds till the last horn */
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

  /**
   * Start a centurion
   */
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
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

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
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
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
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

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Get('tapes')
  public getCenturionTapes(): MixTapeResponse[] {
    return tapes
      .map((t) => ({
        name: t.name,
        coverUrl: t.coverUrl,
        songs: t.feed.filter((e) => e.type === 'song')
          .map((e) => e as Song)
          .map((s) => {
            const songs = !Array.isArray(s.data) ? [s.data] : s.data;
            return songs.map((songData) => ({
              title: songData.title,
              artist: songData.artist,
            }));
          }).flat(),
        duration: Math.max(...t.feed.filter((e) => e.type === 'horn')
          .map((e) => e.timestamp)),
      }));
  }
}
