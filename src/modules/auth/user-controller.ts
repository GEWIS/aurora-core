import { Controller } from '@tsoa/runtime';
import {
  Get, Route, Tags, Response, Security, Request,
} from 'tsoa';
import * as express from 'express';
import { ApiError, HTTPStatus, InternalError } from '../../helpers/customError';
import { User } from './user';

@Route('user')
@Tags('User')
export class UserController extends Controller {
  @Get('me')
  @Response<InternalError>(500, HTTPStatus.InternalServerError)
  @Response<InternalError>(404, 'Not found')
  public async getInformation(@Request() req: express.Request): Promise<User> {
    if (!req.user) {
      throw new ApiError(HTTPStatus.NotFound, 'User info not found.');
    }
    return req.user as User;
  }
}
