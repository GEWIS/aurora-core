import { Repository } from 'typeorm';
import {
  LightsScene,
  LightsSceneMovingHeadRgb,
  LightsSceneMovingHeadWheel,
  LightsScenePars,
} from '../../lights/entities/scenes';
import dataSource from '../../../database';

export interface SceneFixtureParams {
  id: number,
  dmxValues: number[],
}

export interface CreateSceneParams {
  name: string,
  pars: SceneFixtureParams[],
  movingHeadRgbs: SceneFixtureParams[],
  movingHeadWheels: SceneFixtureParams[],
}

export default class ScenesService {
  private repository: Repository<LightsScene>;

  constructor() {
    this.repository = dataSource.getRepository(LightsScene);
  }

  public async getScenes(): Promise<LightsScene[]> {
    return this.repository.find();
  }

  public async getSingleScene(id: number): Promise<LightsScene | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        pars: { par: true },
        movingHeadRgbs: { movingHeadRgb: true },
        movingHeadWheels: { movingHeadWheel: true },
      },
    });
  }

  public async createScene(params: CreateSceneParams): Promise<LightsScene> {
    const lightsScene = await dataSource.transaction(async (manager) => {
      const sceneRepo = manager.getRepository(LightsScene);
      const parsRepo = manager.getRepository(LightsScenePars);
      const movingHeadRgbsRepo = manager.getRepository(LightsSceneMovingHeadRgb);
      const movingHeadWheelsRepo = manager.getRepository(LightsSceneMovingHeadWheel);
      const scene: LightsScene = await sceneRepo.save({
        name: params.name,
      });

      await Promise.all(params.pars
        .map(async ({ id, dmxValues }): Promise<LightsScenePars> => parsRepo.save({
          scene,
          sceneId: scene.id,
          groupParId: id,
          dmxValues,
        })));
      await Promise.all(params.movingHeadRgbs
        .map(async ({ id, dmxValues }): Promise<LightsSceneMovingHeadRgb> => movingHeadRgbsRepo
          .save({
            scene,
            sceneId: scene.id,
            groupParId: id,
            dmxValues,
          })));
      await Promise.all(params.movingHeadWheels
        .map(async ({ id, dmxValues }): Promise<LightsSceneMovingHeadWheel> => movingHeadWheelsRepo
          .save({
            scene,
            sceneId: scene.id,
            groupParId: id,
            dmxValues,
          })));

      return scene;
    });

    const dbScene = await this.getSingleScene(lightsScene.id);
    if (!dbScene) throw new Error('Newly created scene does not exist in the database');
    return dbScene;
  }

  public async deleteScene(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
