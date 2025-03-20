import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags, Response, Request, SuccessResponse, Security, Body, Post } from 'tsoa';
import * as express from 'express';
import { HttpStatusCode } from 'axios';
import { HttpApiException } from '../../helpers/custom-error';
import { AuthUser } from './auth-user';
import { SecurityNames } from '../../helpers/security';
import { securityGroups } from '../../helpers/security-groups';
import AuthService, { UserParams } from './auth-service';
import { LocalUser } from './entities';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Security(SecurityNames.LOCAL, securityGroups.user.base)
  @Get('me')
  @Response<HttpApiException>(HttpStatusCode.NotFound, 'User not found')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getInformation(@Request() req: express.Request): Promise<AuthUser> {
    return req.user!;
  }

  @Security(SecurityNames.LOCAL, securityGroups.user.privileged)
  @Post('create')
  @SuccessResponse(HttpStatusCode.Ok)
  public async createUser(
    @Request() req: express.Request,
    @Body() body: UserParams,
  ): Promise<LocalUser> {
    return new AuthService().createUser(req.body);
  }
}
