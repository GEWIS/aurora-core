import { Controller } from '@tsoa/runtime';
import {
  Get, Route, Tags, Response, Request, SuccessResponse,
} from 'tsoa';
import * as express from 'express';
import { HttpStatusCode } from 'axios';
import { ApiError } from '../../helpers/customError';
import { User } from './user';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Get('me')
  @Response<ApiError>(HttpStatusCode.NotFound, 'User not found')
  @SuccessResponse(HttpStatusCode.Ok)
  public async getInformation(
    @Request() req: express.Request,
  ): Promise<User> {
    if (!req.user) {
      throw new ApiError(HttpStatusCode.NotFound, 'User info not found.');
    }
    return req.user as User;
  }
}
