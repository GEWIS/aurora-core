import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags, Response, Request, SuccessResponse, Security } from 'tsoa';
import * as express from 'express';
import { HttpStatusCode } from 'axios';
import {AuthUser, HttpApiException} from '@gewis/aurora-core-util';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';

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
}
