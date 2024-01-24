import { Repository } from 'typeorm';
import { LightsController } from './entities';
import {
  LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel, LightsPar,
} from '../lights/entities';
import dataSource from '../../database';
import LightsFixture from '../lights/entities/lights-fixture';
import Colors from '../lights/entities/colors';
import LightsMovingHead from '../lights/entities/lights-moving-head';
import LightsGroupPars from '../lights/entities/lights-group-pars';
import LightsGroupMovingHeadRgbs from '../lights/entities/lights-group-moving-head-rgbs';
import LightsGroupMovingHeadWheels from '../lights/entities/lights-group-moving-head-wheels';
import Movement from '../lights/entities/movement';
import AuthService from '../auth/auth-service';

export interface LightsControllerResponse extends Pick<LightsController, 'id' | 'createdAt' | 'updatedAt' | 'name'> {}
export interface LightsFixtureResponse extends Pick<LightsFixture, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'masterDimChannel' | 'strobeChannel'> {}
export interface ColorResponse extends Pick<Colors, 'redChannel' | 'blueChannel' | 'greenChannel' | 'coldWhiteChannel' | 'warmWhiteChannel' | 'amberChannel' | 'uvChannel'> {}
export interface MovingHeadResponse extends LightsFixtureResponse, Movement {}
export interface MovingHeadWheelResponse extends LightsFixtureResponse, Pick<LightsMovingHeadWheel, 'colorWheelChannel' | 'goboWheelChannel' | 'goboRotateChannel'> {}
export interface BaseLightsGroupResponse extends Pick<LightsGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'> {}
export interface LightsGroupResponse extends BaseLightsGroupResponse {
  pars: (LightsFixtureResponse & ColorResponse)[];
  movingHeadRgbs: (MovingHeadResponse & ColorResponse)[];
  movingHeadWheels: MovingHeadWheelResponse[];
}

export interface ColorParams {
  colorRedChannel: number;
  colorGreenChannel: number;
  colorBlueChannel: number;
  colorColdWhiteChannel?: number;
  colorWarmWhiteChannel?: number;
  colorAmberWhiteChannel?: number;
  colorUvChannel?: number;
}

export interface LightsFixtureParams extends Pick<LightsFixture, 'name' | 'masterDimChannel' | 'strobeChannel'> {}

export interface LightsParCreateParams extends LightsFixtureParams, ColorParams {
}

export interface LightsMovingHeadParams extends LightsFixtureParams {
  panChannel: number;
  finePanChannel?: number;
  tiltChannel: number;
  fineTiltChannel?: number;
  movingSpeedChannel?: number;
}

export interface LightsMovingHeadRgbCreateParams extends LightsMovingHeadParams, ColorParams {}

export interface LightsMovingHeadWheelCreateParams extends LightsMovingHeadParams {
  colorWheelChannel: number;
  colorWheelChannelValues: {
    name: string;
    value: number;
  }[];
  goboWheelChannel: number;
  goboWheelChannelValues: {
    name: string;
    value: number;
  }[];
  goboRotateChannel?: number;
}

export interface LightsInGroup {
  fixtureId: number;
  firstChannel: number;
}

export interface LightsGroupCreateParams extends Pick<LightsGroup, 'name'> {
  pars: LightsInGroup[];
  movingHeadRgbs: LightsInGroup[];
  movingHeadWheels: LightsInGroup[];
}

export interface LightsControllerCreateParams extends Pick<LightsController, 'name'> {}

export default class RootLightsService {
  private controllerRepository: Repository<LightsController>;

  private groupRepository: Repository<LightsGroup>;

  constructor() {
    this.controllerRepository = dataSource.getRepository(LightsController);
    this.groupRepository = dataSource.getRepository(LightsGroup);
  }

  private toColorResponse(c: Colors, firstChannel: number): ColorResponse {
    return {
      redChannel: c.redChannel + firstChannel - 1,
      blueChannel: c.blueChannel + firstChannel - 1,
      greenChannel: c.greenChannel + firstChannel - 1,
      coldWhiteChannel: c.coldWhiteChannel ? c.coldWhiteChannel + firstChannel - 1 : null,
      warmWhiteChannel: c.warmWhiteChannel ? c.warmWhiteChannel + firstChannel - 1 : null,
      amberChannel: c.amberChannel ? c.amberChannel + firstChannel - 1 : null,
      uvChannel: c.uvChannel ? c.uvChannel + firstChannel - 1 : null,
    };
  }

  private toMovementResponse(m: Movement, firstChannel: number): Movement {
    return {
      tiltChannel: m.tiltChannel + firstChannel - 1,
      fineTiltChannel: m.fineTiltChannel ? m.fineTiltChannel + firstChannel - 1 : null,
      panChannel: m.panChannel + firstChannel - 1,
      finePanChannel: m.finePanChannel ? m.finePanChannel + firstChannel - 1 : null,
      movingSpeedChannel: m.movingSpeedChannel ? m.movingSpeedChannel + firstChannel - 1 : null,
    };
  }

  private toFixtureResponse(f: LightsFixture, firstChannel: number): LightsFixtureResponse {
    return {
      id: f.id,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      name: f.name,
      masterDimChannel: f.masterDimChannel + firstChannel - 1,
      strobeChannel: f.strobeChannel + firstChannel - 1,
    };
  }

  private toMovingHeadResponse(m: LightsMovingHead, firstChannel: number): MovingHeadResponse {
    return {
      ...this.toFixtureResponse(m, firstChannel),
      ...this.toMovementResponse(m.movement, firstChannel),
    };
  }

  private toLightsGroup(g: LightsGroup): LightsGroupResponse {
    return {
      id: g.id,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      name: g.name,
      pars: g.pars.map((p) => ({
        ...this.toFixtureResponse(p.fixture, p.firstChannel),
        ...this.toColorResponse(p.fixture.color, p.firstChannel),
      })),
      movingHeadRgbs: g.movingHeadRgbs.map((m) => ({
        ...this.toMovingHeadResponse(m.fixture, m.firstChannel),
        ...this.toColorResponse(m.fixture.color, m.firstChannel),
      })),
      movingHeadWheels: g.movingHeadWheels.map((m) => ({
        ...this.toMovingHeadResponse(m.fixture, m.firstChannel),
        colorWheelChannel: m.fixture.colorWheelChannel,
        goboWheelChannel: m.fixture.goboWheelChannel,
        goboRotateChannel: m.fixture.goboRotateChannel
          ? m.fixture.goboRotateChannel + m.firstChannel - 1 : null,
      })),
    };
  }

  private toLightsControllerResponse(c: LightsController): LightsControllerResponse {
    return {
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      name: c.name,
    };
  }

  public async getAllControllers(): Promise<LightsControllerResponse[]> {
    const controllers = await this.controllerRepository.find();
    return controllers.map((c) => this.toLightsControllerResponse(c));
  }

  public async getSingleController(id: number): Promise<LightsController | null> {
    return this.controllerRepository.findOne({ where: { id } });
  }

  public async createController(
    params: LightsControllerCreateParams,
  ): Promise<LightsControllerResponse> {
    const lightsController = await this.controllerRepository.save({
      name: params.name,
    });
    await new AuthService().createApiKey({ lightsController });
    return this.toLightsControllerResponse(lightsController);
  }

  public async getAllLightsGroups(): Promise<BaseLightsGroupResponse[]> {
    const groups = await this.groupRepository.find();
    return groups.map((g) => ({
      id: g.id,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      name: g.name,
    }));
  }

  public async getSingleLightGroup(id: number): Promise<LightsGroup | null> {
    return this.groupRepository.findOne({ where: { id } });
  }

  public async getSingleLightGroupResponse(id: number): Promise<LightsGroupResponse | null> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: {
        pars: { fixture: true },
        movingHeadWheels: { fixture: true },
        movingHeadRgbs: { fixture: true },
      },
    });
    if (group == null) return null;
    return this.toLightsGroup(group);
  }

  public async createLightGroup(
    controllerId: number,
    params: LightsGroupCreateParams,
  ): Promise<LightsGroupResponse | null> {
    const controller = await this.controllerRepository.findOne({ where: { id: controllerId } });
    if (controller == null) return null;

    const g = await dataSource.transaction(async (manager) => {
      const group = await manager.save(LightsGroup, {
        name: params.name,
        controller,
      }) as LightsGroup;

      await Promise.all(params.pars.map(async (p) => {
        const par = await manager.findOne(LightsPar, { where: { id: p.fixtureId } });
        if (par == null) throw new Error(`LightsPar with ID ${p.fixtureId} not found!`);
        await manager.save(LightsGroupPars, {
          group,
          fixture: par,
          firstChannel: p.firstChannel,
        });
      }));

      await Promise.all(params.movingHeadRgbs.map(async (p) => {
        const movingHead = await manager
          .findOne(LightsMovingHeadRgb, { where: { id: p.fixtureId } });
        if (movingHead == null) throw new Error(`LightsMovingHeadRgb with ID ${p.fixtureId} not found!`);
        await manager.save(LightsGroupMovingHeadRgbs, {
          group,
          fixture: movingHead,
          firstChannel: p.firstChannel,
        });
      }));

      await Promise.all(params.movingHeadWheels.map(async (p) => {
        const movingHead = await manager
          .findOne(LightsMovingHeadWheel, { where: { id: p.fixtureId } });
        if (movingHead == null) throw new Error(`LightsMovingHeadWheel with ID ${p.fixtureId} not found!`);
        await manager.save(LightsGroupMovingHeadWheels, {
          group,
          fixture: movingHead,
          firstChannel: p.firstChannel,
        });
      }));

      return group;
    });

    return this.getSingleLightGroupResponse(g.id);
  }

  public async getLightsGroupPar(id: number): Promise<LightsGroupPars | null> {
    const repository = dataSource.getRepository(LightsGroupPars);
    return repository.findOne({ where: { id } });
  }

  public async getLightsGroupMovingHeadRgb(id: number): Promise<LightsGroupMovingHeadRgbs | null> {
    const repository = dataSource.getRepository(LightsGroupMovingHeadRgbs);
    return repository.findOne({ where: { id } });
  }

  public async getLightsGroupMovingHeadWheel(id: number): Promise<LightsGroupMovingHeadWheels | null> {
    const repository = dataSource.getRepository(LightsGroupMovingHeadWheels);
    return repository.findOne({ where: { id } });
  }

  private toFixture(params: LightsFixtureParams): LightsFixture {
    return {
      name: params.name,
      masterDimChannel: params.masterDimChannel,
      strobeChannel: params.strobeChannel,
    } as LightsFixture;
  }

  private toColor(params: ColorParams): Colors {
    return {
      redChannel: params.colorRedChannel,
      blueChannel: params.colorBlueChannel,
      greenChannel: params.colorGreenChannel,
      coldWhiteChannel: params.colorColdWhiteChannel,
      warmWhiteChannel: params.colorWarmWhiteChannel,
      amberChannel: params.colorAmberWhiteChannel,
      uvChannel: params.colorUvChannel,
    };
  }

  private toMovement(params: LightsMovingHeadParams): Movement {
    return {
      panChannel: params.panChannel,
      finePanChannel: params.finePanChannel,
      tiltChannel: params.tiltChannel,
      fineTiltChannel: params.fineTiltChannel,
      movingSpeedChannel: params.movingSpeedChannel,
    } as Movement;
  }

  public async getAllLightsPars(): Promise<LightsPar[]> {
    return dataSource.getRepository(LightsPar).find();
  }

  public async getAllMovingHeadRgbs(): Promise<LightsMovingHeadRgb[]> {
    return dataSource.getRepository(LightsMovingHeadRgb).find();
  }

  public async getAllMovingHeadWheels(): Promise<LightsMovingHeadWheel[]> {
    return dataSource.getRepository(LightsMovingHeadWheel).find();
  }

  public async createLightsPar(params: LightsParCreateParams): Promise<LightsPar> {
    const repository = dataSource.getRepository(LightsPar);
    return repository.save({
      ...this.toFixture(params),
      color: this.toColor(params),
    });
  }

  public async createMovingHeadRgb(
    params: LightsMovingHeadRgbCreateParams,
  ): Promise<LightsMovingHeadRgb> {
    const repository = dataSource.getRepository(LightsMovingHeadRgb);
    return repository.save({
      ...this.toFixture(params),
      movement: this.toMovement(params),
      color: this.toColor(params),
    });
  }

  public async createMovingHeadWheel(
    params: LightsMovingHeadWheelCreateParams,
  ): Promise<LightsMovingHeadWheel> {
    const repository = dataSource.getRepository(LightsMovingHeadWheel);
    return repository.save({
      ...this.toFixture(params),
      movement: this.toMovement(params),
      colorWheelChannel: params.colorWheelChannel,
      goboWheelChannel: params.goboWheelChannel,
      goboRotateChannel: params.goboRotateChannel,
    });
  }
}
