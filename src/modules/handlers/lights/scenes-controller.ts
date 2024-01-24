import { Controller } from '@tsoa/runtime';
import {
  Body, Delete, Get, Post, Route, Security, Tags,
} from 'tsoa';
import ScenesService, { CreateSceneParams } from './scenes-service';
import RootLightsService from '../../root/root-lights-service';
import HandlerManager from '../../root/handler-manager';
import { LightsGroup } from '../../lights/entities';
import { ScenesHandler } from './scenes-handler';
import { SecurityGroup } from '../../../helpers/security';

@Route('handler/lights/scenes')
@Tags('Handlers')
export class ScenesController extends Controller {
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Get('')
  public async getAllScenes() {
    return new ScenesService().getScenes();
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Get('{id}')
  public async getSingleScene(id: number) {
    return new ScenesService().getSingleScene(id);
  }

  /**
   * Create a new scene
   * @param params
   */
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO])
  @Post('')
  public async createScene(@Body() params: CreateSceneParams) {
    const lightsService = new RootLightsService();

    const dbPars = await Promise.all(params.pars
      .map(async ({ id }) => lightsService.getLightsGroupPar(id)));
    const missingPars = params.pars.filter((f, index) => dbPars[index] == null);

    const dbMovingHeadRgbs = await Promise.all(params.movingHeadRgbs
      .map(async ({ id }) => lightsService.getLightsGroupMovingHeadRgb(id)));
    const missingMovingHeadRgbs = params.movingHeadRgbs
      .filter((f, index) => dbMovingHeadRgbs[index] == null);

    const dbMovingHeadWheels = await Promise.all(params.movingHeadWheels
      .map(async ({ id }) => lightsService.getLightsGroupMovingHeadWheel(id)));
    const missingMovingHeadWheels = params.movingHeadWheels
      .filter((p, index) => dbMovingHeadWheels[index] == null);

    if (missingPars.length > 0
      || missingMovingHeadRgbs.length > 0
      || missingMovingHeadWheels.length > 0
    ) {
      this.setStatus(400);
      return {
        message: 'Some fixtures do not exist',
        missingPars,
        missingMovingHeadRgbs,
        missingMovingHeadWheels,
      };
    }

    return new ScenesService().createScene(params);
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO])
  @Delete('{id}')
  public async deleteScene(id: number) {
    const service = new ScenesService();
    const scene = await service.getSingleScene(id);
    if (!scene) {
      this.setStatus(404);
      return;
    }
    await service.deleteScene(id);
  }

  /**
   * Apply the current scene to all lights that are registered to the ScenesHandler
   * @param id
   */
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BAC, SecurityGroup.BOARD])
  @Post('{id}/apply')
  public async applyScene(id: number) {
    const service = new ScenesService();
    const scene = await service.getSingleScene(id);
    if (!scene) {
      this.setStatus(404);
      return;
    }

    const handler: ScenesHandler | undefined = HandlerManager.getInstance().getHandlers(LightsGroup)
      .find((h) => h.constructor.name === ScenesHandler.name) as ScenesHandler | undefined;
    if (!handler) throw new Error('ScenesHandler not found');

    handler.applyScene(scene);
  }
}
