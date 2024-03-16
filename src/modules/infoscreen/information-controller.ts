import { Controller } from '@tsoa/runtime';
import {
  Body,
  Get,
  Route,
  Tags,
  Response,
  Post,
  Security,
  SuccessResponse,
  ValidateError,
} from 'tsoa';
import InformationService, { InformationParams } from './information-service';
import Information from './entities/information';
import { HttpStatusCode } from '../../helpers/customError';
import { SecurityGroup } from '../../helpers/security';
import { Member } from './entities/ldap-connector';

@Route('infoscreen')
@Tags('Infoscreen')
export class InformationController extends Controller {
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BOARD,
    SecurityGroup.KEY_HOLDER,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Get('information')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getInformation(): Promise<Information> {
    return new InformationService().getInformation();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BOARD,
    SecurityGroup.KEY_HOLDER,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Post('information')
  @Response<ValidateError>(HttpStatusCode.BadRequest, 'Invalid Information')
  @SuccessResponse(HttpStatusCode.Ok)
  public async setInformation(@Body() params: InformationParams): Promise<Information> {
    return new InformationService().setInformation(params);
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BOARD,
    SecurityGroup.KEY_HOLDER,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Get('keyholders')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getKeyHolders(): Promise<Array<Member>> {
    return new InformationService().getKeyHolders();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BOARD,
    SecurityGroup.KEY_HOLDER,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Get('board')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getBoard(): Promise<Array<Member>> {
    return new InformationService().getBoard();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.BOARD,
    SecurityGroup.KEY_HOLDER,
    SecurityGroup.SCREEN_SUBSCRIBER,
  ])
  @Get('ero')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getERO(): Promise<Array<Member>> {
    return new InformationService().getERO();
  }
}
