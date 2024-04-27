import { Controller, TsoaResponse } from '@tsoa/runtime';
import { Body, Delete, Get, Post, Query, Res, Route, Security, Tags } from 'tsoa';
import ScenesService, { CreateSceneParams, LightsSceneResponse } from './scenes-service';
import RootLightsService from '../../root/root-lights-service';
import HandlerManager from '../../root/handler-manager';
import { LightsGroup } from '../../lights/entities';
import { ScenesHandler } from './scenes-handler';
import { SecurityGroup } from '../../../helpers/security';

@Route('handler/lights/scenes')
@Tags('Handlers')
export class ScenesController extends Controller {
  /**
   * Get a list of all scenes
   * @param favorite Whether to return only scenes that are (not) marked as favorite
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Get('')
  public async getAllScenes(@Query() favorite?: boolean): Promise<LightsSceneResponse[]> {
    const scenes = await new ScenesService().getScenes({ favorite });
    return scenes.map((s) => ScenesService.toSceneResponse(s));
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Get('{id}')
  public async getSingleScene(id: number): Promise<LightsSceneResponse | undefined> {
    const scene = await new ScenesService().getSingleScene(id);
    if (!scene) {
      this.setStatus(404);
      return undefined;
    }
    return ScenesService.toSceneResponse(scene);
  }

  /**
   * Create a new scene
   * @param params
   * @param invalidSceneResponse
   */
  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO])
  @Post('')
  public async createScene(
    @Body() params: CreateSceneParams,
    @Res() invalidSceneResponse: TsoaResponse<400, { reason: string }>,
  ) {
    const lightsService = new RootLightsService();

    const lightGroupIds = params.effects
      .map((e) => e.lightsGroups)
      .flat()
      .sort();
    const dbGroups = await Promise.all(
      lightGroupIds.map(async (id) => ({
        id,
        group: await lightsService.getSingleLightsGroup(id),
      })),
    );
    const missingGroups = dbGroups.filter(({ group }) => group == null);
    if (missingGroups.length > 0) {
      return invalidSceneResponse(400, {
        reason: `LightsGroups with IDs ${missingGroups.join(',')} do not exist.`,
      });
    }

    const scene = await new ScenesService().createScene(params);
    return ScenesService.toSceneResponse(scene);
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
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Post('{id}/apply')
  public async applyScene(id: number) {
    const service = new ScenesService();
    const scene = await service.getSingleScene(id);
    if (!scene) {
      this.setStatus(404);
      return;
    }

    const handler: ScenesHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === ScenesHandler.name) as ScenesHandler | undefined;
    if (!handler) throw new Error('ScenesHandler not found');

    handler.applyScene(scene);
  }

  /**
   * Clear the scene that is applied to the ScenesHandler
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD,
  ])
  @Delete('clear')
  public async clearScene() {
    const handler: ScenesHandler | undefined = HandlerManager.getInstance()
      .getHandlers(LightsGroup)
      .find((h) => h.constructor.name === ScenesHandler.name) as ScenesHandler | undefined;
    if (!handler) throw new Error('ScenesHandler not found');

    handler.clearScene();
  }
}
