import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags, Response, Request, SuccessResponse, Security } from 'tsoa';
import * as express from 'express';
import { HttpStatusCode } from 'axios';
import { ApiException } from '../../helpers/customError';
import { User } from './user';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Security('local', ['*'])
  @Get('me')
  @Response<ApiException>(HttpStatusCode.NotFound, 'User not found')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getInformation(@Request() req: express.Request): Promise<User> {
    return req.user as User;
  }
}
