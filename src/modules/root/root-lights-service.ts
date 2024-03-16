import { Repository } from "typeorm";
import { LightsController } from "./entities";
import { LightsGroup, LightsMovingHeadRgb, LightsMovingHeadWheel, LightsPar } from "../lights/entities";
import dataSource from "../../database";
import LightsFixture from "../lights/entities/lights-fixture";
import Colors from "../lights/entities/colors";
import LightsMovingHead from "../lights/entities/lights-moving-head";
import LightsGroupPars from "../lights/entities/lights-group-pars";
import LightsGroupMovingHeadRgbs from "../lights/entities/lights-group-moving-head-rgbs";
import LightsGroupMovingHeadWheels from "../lights/entities/lights-group-moving-head-wheels";
import Movement from "../lights/entities/movement";
import AuthService from "../auth/auth-service";
import LightsParShutterOptions from "../lights/entities/lights-par-shutter-options";
import LightsMovingHeadRgbShutterOptions from "../lights/entities/lights-moving-head-rgb-shutter-options";
import LightsMovingHeadWheelShutterOptions from "../lights/entities/lights-moving-head-wheel-shutter-options";
import LightsFixtureShutterOptions, { ShutterOption } from "../lights/entities/lights-fixture-shutter-options";

export interface LightsControllerResponse
  extends Pick<LightsController, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'socketIds'> {}

export interface LightsFixtureResponse
  extends Pick<
    LightsFixture,
    'id' | 'createdAt' | 'updatedAt' | 'name' | 'masterDimChannel' | 'shutterChannel'
  > {}

// do not remove; tsoa cannot deal with multiple utility types.
// https://github.com/lukeautry/tsoa/issues/1238
// prettier-ignore
export interface ColorResponse
  extends Pick<
    Colors,
    'redChannel' | 'blueChannel' | 'greenChannel' | 'coldWhiteChannel' | 'warmWhiteChannel' | 'amberChannel' | 'uvChannel'
  > {}

export interface ParResponse extends LightsFixtureResponse, ColorResponse {}

export interface MovingHeadResponse extends LightsFixtureResponse, Movement {}

export interface MovingHeadRgbResponse extends MovingHeadResponse, ColorResponse {}

export interface MovingHeadWheelResponse
  extends LightsFixtureResponse,
    Pick<LightsMovingHeadWheel, 'colorWheelChannel' | 'goboWheelChannel' | 'goboRotateChannel'> {}

export interface BaseLightsGroupResponse
  extends Pick<LightsGroup, 'id' | 'createdAt' | 'updatedAt' | 'name'> {}

export interface LightsGroupResponse extends BaseLightsGroupResponse {
  controller: LightsControllerResponse;
  pars: ParResponse[];
  movingHeadRgbs: MovingHeadRgbResponse[];
  movingHeadWheels: MovingHeadWheelResponse[];
}

export interface ColorParams {
  colorRedChannel: number;
  colorGreenChannel: number;
  colorBlueChannel: number;
  colorColdWhiteChannel?: number;
  colorWarmWhiteChannel?: number;
  colorAmberChannel?: number;
  colorUvChannel?: number;
}

export interface ShutterOptionValues {
  open: number;
  strobe: number;
}

export interface LightsFixtureParams
  extends Pick<LightsFixture, 'name' | 'masterDimChannel' | 'shutterChannel'> {
  shutterOptionValues: ShutterOptionValues;
}

export interface LightsParCreateParams extends LightsFixtureParams, ColorParams {}

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

  private static toColorResponse(c: Colors, firstChannel: number): ColorResponse {
    return {
      redChannel: c.redChannel + firstChannel - 1,
      blueChannel: c.blueChannel + firstChannel - 1,
      greenChannel: c.greenChannel + firstChannel - 1,
      coldWhiteChannel: c.coldWhiteChannel ? c.coldWhiteChannel + firstChannel - 1 : null,
      warmWhiteChannel: c.warmWhiteChannel ? c.warmWhiteChannel + firstChannel - 1 : null,
      amberChannel: c.amberChannel ? c.amberChannel + firstChannel - 1 : null,
      uvChannel: c.uvChannel ? c.uvChannel + firstChannel - 1 : null
    };
  }

  private static toMovementResponse(m: Movement, firstChannel: number): Movement {
    return {
      tiltChannel: m.tiltChannel + firstChannel - 1,
      fineTiltChannel: m.fineTiltChannel ? m.fineTiltChannel + firstChannel - 1 : null,
      panChannel: m.panChannel + firstChannel - 1,
      finePanChannel: m.finePanChannel ? m.finePanChannel + firstChannel - 1 : null,
      movingSpeedChannel: m.movingSpeedChannel ? m.movingSpeedChannel + firstChannel - 1 : null
    };
  }

  private static toFixtureResponse(f: LightsFixture, firstChannel: number): LightsFixtureResponse {
    return {
      id: f.id,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      name: f.name,
      masterDimChannel: f.masterDimChannel + firstChannel - 1,
      shutterChannel: f.shutterChannel + firstChannel - 1
    };
  }

  private static toMovingHeadResponse(
    m: LightsMovingHead,
    firstChannel: number
  ): MovingHeadResponse {
    return {
      ...this.toFixtureResponse(m, firstChannel),
      ...this.toMovementResponse(m.movement, firstChannel)
    };
  }

  public static toParResponse(p: LightsPar, firstChannel = 1): ParResponse {
    return {
      ...this.toFixtureResponse(p, firstChannel),
      ...this.toColorResponse(p.color, firstChannel)
    };
  }

  public static toMovingHeadRgbResponse(
    m: LightsMovingHeadRgb,
    firstChannel = 1
  ): MovingHeadRgbResponse {
    return {
      ...this.toMovingHeadResponse(m, firstChannel),
      ...this.toColorResponse(m.color, firstChannel)
    };
  }

  public static toMovingHeadWheelResponse(
    m: LightsMovingHeadWheel,
    firstChannel = 1
  ): MovingHeadWheelResponse {
    return {
      ...this.toMovingHeadResponse(m, firstChannel),
      colorWheelChannel: m.colorWheelChannel,
      goboWheelChannel: m.goboWheelChannel,
      goboRotateChannel: m.goboRotateChannel ? m.goboRotateChannel + firstChannel - 1 : null
    };
  }

  public static toLightsGroupResponse(g: LightsGroup): LightsGroupResponse {
    return {
      id: g.id,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      name: g.name,
      controller: this.toLightsControllerResponse(g.controller),
      pars: g.pars.map((p) => this.toParResponse(p.fixture, p.firstChannel)),
      movingHeadRgbs: g.movingHeadRgbs.map((m) =>
        this.toMovingHeadRgbResponse(m.fixture, m.firstChannel)
      ),
      movingHeadWheels: g.movingHeadWheels.map((m) =>
        this.toMovingHeadWheelResponse(m.fixture, m.firstChannel)
      )
    };
  }

  public static toLightsControllerResponse(c: LightsController): LightsControllerResponse {
    return {
      id: c.id,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      name: c.name,
      socketIds: c.socketIds
    };
  }

  public async getAllControllers(): Promise<LightsController[]> {
    return this.controllerRepository.find();
  }

  public async getSingleController(id: number): Promise<LightsController | null> {
    return this.controllerRepository.findOne({ where: { id } });
  }

  public async createController(params: LightsControllerCreateParams): Promise<LightsController> {
    const lightsController = await this.controllerRepository.save({
      name: params.name
    });
    await new AuthService().createApiKey({ lightsController });
    return lightsController;
  }

  public async getAllLightsGroups(): Promise<LightsGroup[]> {
    return this.groupRepository.find();
  }

  public async getSingleLightsGroup(id: number): Promise<LightsGroup | null> {
    return this.groupRepository.findOne({ where: { id } });
  }

  public async createLightGroup(
    controllerId: number,
    params: LightsGroupCreateParams
  ): Promise<LightsGroup | null> {
    const controller = await this.controllerRepository.findOne({ where: { id: controllerId } });
    if (controller == null) return null;

    return dataSource.transaction(async (manager) => {
      const group = (await manager.save(LightsGroup, {
        name: params.name,
        controller
      })) as LightsGroup;

      await Promise.all(
        params.pars.map(async (p) => {
          const par = await manager.findOne(LightsPar, { where: { id: p.fixtureId } });
          if (par == null) throw new Error(`LightsPar with ID ${p.fixtureId} not found!`);
          await manager.save(LightsGroupPars, {
            group,
            fixture: par,
            firstChannel: p.firstChannel
          });
        })
      );

      await Promise.all(
        params.movingHeadRgbs.map(async (p) => {
          const movingHead = await manager.findOne(LightsMovingHeadRgb, {
            where: { id: p.fixtureId }
          });
          if (movingHead == null)
            throw new Error(`LightsMovingHeadRgb with ID ${p.fixtureId} not found!`);
          await manager.save(LightsGroupMovingHeadRgbs, {
            group,
            fixture: movingHead,
            firstChannel: p.firstChannel
          });
        })
      );

      await Promise.all(
        params.movingHeadWheels.map(async (p) => {
          const movingHead = await manager.findOne(LightsMovingHeadWheel, {
            where: { id: p.fixtureId }
          });
          if (movingHead == null)
            throw new Error(`LightsMovingHeadWheel with ID ${p.fixtureId} not found!`);
          await manager.save(LightsGroupMovingHeadWheels, {
            group,
            fixture: movingHead,
            firstChannel: p.firstChannel
          });
        })
      );

      return group;
    });
  }

  public async getLightsGroupPar(id: number): Promise<LightsGroupPars | null> {
    const repository = dataSource.getRepository(LightsGroupPars);
    return repository.findOne({ where: { id } });
  }

  public async getLightsGroupMovingHeadRgb(id: number): Promise<LightsGroupMovingHeadRgbs | null> {
    const repository = dataSource.getRepository(LightsGroupMovingHeadRgbs);
    return repository.findOne({ where: { id } });
  }

  public async getLightsGroupMovingHeadWheel(
    id: number
  ): Promise<LightsGroupMovingHeadWheels | null> {
    const repository = dataSource.getRepository(LightsGroupMovingHeadWheels);
    return repository.findOne({ where: { id } });
  }

  private toFixture(params: LightsFixtureParams): LightsFixture {
    return {
      name: params.name,
      masterDimChannel: params.masterDimChannel,
      shutterChannel: params.shutterChannel
    } as LightsFixture;
  }

  private toColor(params: ColorParams): Colors {
    return {
      redChannel: params.colorRedChannel,
      blueChannel: params.colorBlueChannel,
      greenChannel: params.colorGreenChannel,
      coldWhiteChannel: params.colorColdWhiteChannel,
      warmWhiteChannel: params.colorWarmWhiteChannel,
      amberChannel: params.colorAmberChannel,
      uvChannel: params.colorUvChannel
    };
  }

  private toMovement(params: LightsMovingHeadParams): Movement {
    return {
      panChannel: params.panChannel,
      finePanChannel: params.finePanChannel,
      tiltChannel: params.tiltChannel,
      fineTiltChannel: params.fineTiltChannel,
      movingSpeedChannel: params.movingSpeedChannel
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

  public async createFixtureShutterOptions(
    repo: Repository<LightsParShutterOptions | LightsMovingHeadRgbShutterOptions | LightsMovingHeadWheelShutterOptions>,
    fixture: LightsFixture,
    params: ShutterOptionValues,
  ): Promise<LightsFixtureShutterOptions[]> {
    return Promise.all([
      repo.save({ fixtureId: fixture.id, shutterOption: ShutterOption.OPEN, channelValue: params.open }),
      repo.save({ fixtureId: fixture.id, shutterOption: ShutterOption.STROBE, channelValue: params.strobe }),
    ]);
  }

  public async createLightsPar(params: LightsParCreateParams): Promise<LightsPar> {
    const repository = dataSource.getRepository(LightsPar);
    const par = await repository.save({
      ...this.toFixture(params),
      color: this.toColor(params)
    });
    par.shutterOptions = await this.createFixtureShutterOptions(
      dataSource.getRepository(LightsParShutterOptions),
      par,
      params.shutterOptionValues,
    ) as LightsParShutterOptions[];
    return par;
  }

  public async createMovingHeadRgb(
    params: LightsMovingHeadRgbCreateParams
  ): Promise<LightsMovingHeadRgb> {
    const repository = dataSource.getRepository(LightsMovingHeadRgb);
    const movingHead = await repository.save({
      ...this.toFixture(params),
      movement: this.toMovement(params),
      color: this.toColor(params)
    });
    movingHead.shutterOptions = await this.createFixtureShutterOptions(
      dataSource.getRepository(LightsMovingHeadRgbShutterOptions),
      movingHead,
      params.shutterOptionValues,
    ) as LightsMovingHeadRgbShutterOptions[];
    return movingHead;
  }

  public async createMovingHeadWheel(
    params: LightsMovingHeadWheelCreateParams
  ): Promise<LightsMovingHeadWheel> {
    const repository = dataSource.getRepository(LightsMovingHeadWheel);
    const movingHead = await repository.save({
      ...this.toFixture(params),
      movement: this.toMovement(params),
      colorWheelChannel: params.colorWheelChannel,
      goboWheelChannel: params.goboWheelChannel,
      goboRotateChannel: params.goboRotateChannel
    });
    movingHead.shutterOptions = await this.createFixtureShutterOptions(
      dataSource.getRepository(LightsMovingHeadWheelShutterOptions),
      movingHead,
      params.shutterOptionValues,
    ) as LightsMovingHeadWheelShutterOptions[];
    return movingHead;
  }
}
