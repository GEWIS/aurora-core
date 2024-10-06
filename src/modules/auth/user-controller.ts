import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags, Response, Request, SuccessResponse, Security } from 'tsoa';
import * as express from 'express';
import { HttpStatusCode } from 'axios';
import { HttpApiException } from '../../helpers/customError';
import { AuthUser } from './authUser';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Security('local', ['*'])
  @Get('me')
  @Response<HttpApiException>(HttpStatusCode.NotFound, 'User not found')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getInformation(@Request() req: express.Request): Promise<AuthUser> {
    return req.user!;
  }
}
