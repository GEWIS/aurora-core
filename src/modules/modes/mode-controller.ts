import { Body, Delete, Post, Route, Security, SuccessResponse, Tags } from 'tsoa';
import { Controller } from '@tsoa/runtime';
import { In } from 'typeorm';
import HandlerManager from '../root/handler-manager';
import ModeManager from './mode-manager';
import SubscribeEntity from '../root/entities/subscribe-entity';
import { LightsGroup } from '../lights/entities';
import { Audio, Screen } from '../root/entities';
import CenturionMode from './centurion/centurion-mode';
import tapes from './centurion/tapes';
import dataSource from '../../database';
import { SecurityGroup } from '../../helpers/security';
import { HttpStatusCode } from '../../helpers/customError';

interface EnableModeParams {
  lightsGroupIds: number[];
  screenIds: number[];
  audioIds: number[];
}

interface CenturionParams extends EnableModeParams {
  centurionName: string;
}

@Route('modes')
@Tags('Modes')
export class ModeController extends Controller {
  private handlerManager: HandlerManager;

  private modeManager: ModeManager;

  constructor() {
    super();
    this.handlerManager = HandlerManager.getInstance();
    this.modeManager = ModeManager.getInstance();
  }

  private async findEntities(
    entity: typeof SubscribeEntity,
    ids: number[]
  ): Promise<SubscribeEntity[]> {
    return dataSource.getRepository(entity).find({ where: { id: In(ids) } });
  }

  private async mapBodyToEntities(params: EnableModeParams) {
    const lights = (await this.findEntities(LightsGroup, params.lightsGroupIds)) as LightsGroup[];
    const screens = (await this.findEntities(Screen, params.lightsGroupIds)) as Screen[];
    const audios = (await this.findEntities(Audio, params.lightsGroupIds)) as Audio[];

    return { lights, screens, audios };
  }

  /**
   * Enable Centurion mode for the given devices
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('centurion')
  @SuccessResponse(HttpStatusCode.NoContent)
  public async enableCenturion(@Body() params: CenturionParams): Promise<string> {
    const { lights, screens, audios } = await this.mapBodyToEntities(params);

    const centurionMode = new CenturionMode(lights, screens, audios);
    centurionMode.initialize(this.modeManager.musicEmitter);
    const tape = tapes.find((t) => t.name === params.centurionName);
    if (tape === undefined) {
      this.setStatus(404);
      return 'Centurion tape not found.';
    }
    centurionMode.loadTape(tape);
    this.modeManager.enableMode(CenturionMode, centurionMode, 'centurion');

    this.setStatus(204);
    return '';
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Delete('centurion')
  @SuccessResponse(HttpStatusCode.Ok)
  public disableCenturion() {
    this.modeManager.disableMode(CenturionMode, 'centurion');
  }
}
