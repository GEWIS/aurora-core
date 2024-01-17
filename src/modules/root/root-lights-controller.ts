import {
  Body, Get, Post, Route, Tags,
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
import { rgbColorDefinitions } from '../lights/color-definitions';

@Route('lights')
@Tags('Lights')
export class RootLightsController extends Controller {
  @Get('controller')
  public async getLightsControllers() {
    return new RootLightsService().getAllControllers();
  }

  @Get('controller/{id}')
  public async getSingleLightsController(id: number) {
    return new RootLightsService().getSingleController(id);
  }

  @Post('controller')
  public async createLightsController(@Body() params: LightsControllerCreateParams) {
    return new RootLightsService().createController(params);
  }

  @Get('group')
  public async getLightsGroups() {
    return new RootLightsService().getAllLightsGroups();
  }

  @Get('group/{id}')
  public async getSingleLightsGroup(id: number) {
    return new RootLightsService().getSingleLightGroupResponse(id);
  }

  @Post('controller/{controllerId}/group')
  public async createLightsGroup(controllerId: number, @Body() params: LightsGroupCreateParams) {
    return new RootLightsService().createLightGroup(controllerId, params);
  }

  @Get('fixture/par')
  public async getAllLightsPars() {
    return new RootLightsService().getAllLightsPars();
  }

  @Post('fixture/par')
  public async createLightsPar(@Body() params: LightsParCreateParams) {
    return new RootLightsService().createLightsPar(params);
  }

  @Get('fixture/moving-head/rgb')
  public async getAllLightsMovingHeadsRgb() {
    return new RootLightsService().getAllMovingHeadRgbs();
  }

  @Post('fixture/moving-head/rgb')
  public async createLightsMovingHeadRgb(@Body() params: LightsMovingHeadRgbCreateParams) {
    return new RootLightsService().createMovingHeadRgb(params);
  }

  @Get('fixture/moving-head/wheel')
  public async getAllLightsMovingHeadsWheel() {
    return new RootLightsService().getAllMovingHeadWheels();
  }

  @Post('fixture/moving-head/wheel')
  public async createLightsMovingHeadWheel(@Body() params: LightsMovingHeadWheelCreateParams) {
    return new RootLightsService().createMovingHeadWheel(params);
  }

  @Get('effects')
  public getAllLightsEffects() {
    return LIGHTS_EFFECTS.map((e) => e.name);
  }

  @Get('colors')
  public getAllLightsColors() {
    return rgbColorDefinitions;
  }
}
