import { Repository } from 'typeorm';
import { LightsScene, LightsSceneEffect } from '../../lights/entities/scenes';
import dataSource from '../../../database';
import { BaseLightsGroupResponse } from '../../root/root-lights-service';

export interface LightsSceneEffectResponse {
  effectName: string;
  lightsGroups: BaseLightsGroupResponse[];
}

export interface LightsSceneResponse {
  name: string;
  favorite: boolean;
  effects: LightsSceneEffectResponse[];
}

export interface LightsSceneEffectParams {
  effectName: string;
  lightsGroups: number[];
}

export interface CreateSceneParams {
  name: string;
  favorite: boolean;
  effects: LightsSceneEffectParams[];
}

export interface GetLightsSceneOptions {
  favorite?: boolean;
}

export default class ScenesService {
  private repository: Repository<LightsScene>;

  constructor() {
    this.repository = dataSource.getRepository(LightsScene);
  }

  public static toSceneResponse(scene: LightsScene): LightsSceneResponse {
    const effectsMap: Map<string, BaseLightsGroupResponse[]> = new Map();
    scene.effects.forEach((e) => {
      if (effectsMap.has(e.effectName)) {
        effectsMap.get(e.effectName)?.push({
          id: e.group.id,
          createdAt: e.group.createdAt,
          updatedAt: e.group.updatedAt,
          name: e.group.name,
        });
      } else {
        effectsMap.set(e.effectName, [
          {
            id: e.group.id,
            createdAt: e.group.createdAt,
            updatedAt: e.group.updatedAt,
            name: e.group.name,
          },
        ]);
      }
    });

    const effects: LightsSceneEffectResponse[] = [];
    effectsMap.forEach((lightsGroups, effectName) => {
      effects.push({ effectName, lightsGroups });
    });

    return {
      name: scene.name,
      favorite: scene.favorite,
      effects,
    };
  }

  public async getScenes(options?: GetLightsSceneOptions): Promise<LightsScene[]> {
    return this.repository.find({
      where: { favorite: options?.favorite },
    });
  }

  public async getSingleScene(id: number): Promise<LightsScene | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  public async createScene(params: CreateSceneParams): Promise<LightsScene> {
    const lightsScene = await dataSource.transaction(async (manager) => {
      const sceneRepo = manager.getRepository(LightsScene);
      const sceneEffectRepo = manager.getRepository(LightsSceneEffect);
      const scene: LightsScene = await sceneRepo.save({
        name: params.name,
        favorite: params.favorite,
      });

      await Promise.all(
        params.effects
          .map(({ effectName, lightsGroups }) =>
            lightsGroups.map((groupId) =>
              sceneEffectRepo.save({
                effectName,
                groupId,
              }),
            ),
          )
          .flat(),
      );

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
