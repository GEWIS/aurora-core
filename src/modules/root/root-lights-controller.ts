import {
  Body, Get, Post, Route, Security, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import RootLightsService, {
  LightsControllerCreateParams,
  LightsGroupCreateParams,
  LightsMovingHeadRgbCreateParams,
  LightsMovingHeadWheelCreateParams,
  LightsParCreateParams,
} from './root-lights-service';
import { LIGHTS_EFFECTS } from '../lights/effects';
import {
  RgbColor, rgbColorDefinitions, rgbColors, RgbColorSpecification,
} from '../lights/color-definitions';
import { SecurityGroup } from '../../helpers/security';

interface LightsColorResponse {
  color: RgbColor;
  spec: RgbColorSpecification;
}

@Route('lights')
@Tags('Lights')
export class RootLightsController extends Controller {
  @Security('local', ['*'])
  @Get('controller')
  public async getLightsControllers() {
    return new RootLightsService().getAllControllers();
  }

  @Security('local', ['*'])
  @Get('controller/{id}')
  public async getSingleLightsController(id: number) {
    return new RootLightsService().getSingleController(id);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('controller')
  public async createLightsController(@Body() params: LightsControllerCreateParams) {
    return new RootLightsService().createController(params);
  }

  @Security('local', ['*'])
  @Get('group')
  public async getLightsGroups() {
    return new RootLightsService().getAllLightsGroups();
  }

  @Security('local', ['*'])
  @Get('group/{id}')
  public async getSingleLightsGroup(id: number) {
    return new RootLightsService().getSingleLightGroupResponse(id);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('controller/{controllerId}/group')
  public async createLightsGroup(controllerId: number, @Body() params: LightsGroupCreateParams) {
    return new RootLightsService().createLightGroup(controllerId, params);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Get('fixture/par')
  public async getAllLightsPars() {
    return new RootLightsService().getAllLightsPars();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('fixture/par')
  public async createLightsPar(@Body() params: LightsParCreateParams) {
    return new RootLightsService().createLightsPar(params);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Get('fixture/moving-head/rgb')
  public async getAllLightsMovingHeadsRgb() {
    return new RootLightsService().getAllMovingHeadRgbs();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('fixture/moving-head/rgb')
  public async createLightsMovingHeadRgb(@Body() params: LightsMovingHeadRgbCreateParams) {
    return new RootLightsService().createMovingHeadRgb(params);
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Get('fixture/moving-head/wheel')
  public async getAllLightsMovingHeadsWheel() {
    return new RootLightsService().getAllMovingHeadWheels();
  }

  @Security('local', [SecurityGroup.ADMIN])
  @Post('fixture/moving-head/wheel')
  public async createLightsMovingHeadWheel(@Body() params: LightsMovingHeadWheelCreateParams) {
    return new RootLightsService().createMovingHeadWheel(params);
  }

  @Security('local', ['*'])
  @Get('effects')
  public getAllLightsEffects() {
    return LIGHTS_EFFECTS.map((e) => e.name);
  }

  @Security('local', ['*'])
  @Get('colors')
  public getAllLightsColors(): LightsColorResponse[] {
    return rgbColors.map((color: RgbColor): LightsColorResponse => ({
      color,
      spec: rgbColorDefinitions[color],
    }));
  }
}
