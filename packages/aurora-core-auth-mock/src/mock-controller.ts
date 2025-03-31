import { Route, Tags, Controller, Request, Post, Body } from 'tsoa';
import { Request as ExRequest } from 'express';
import { AuthUser } from '@gewis/aurora-core-util';
import passport from 'passport';

@Route('auth')
@Tags('Authentication')
export class LocalAuthController extends Controller {
  @Post('mock')
  public async authMock(@Request() req: ExRequest, @Body() _: AuthUser) {
    return new Promise((resolve, reject) => {
      passport.authenticate('mock')(req, req.res!, (err: Error) => {
        if (err) reject(err);
        resolve(req.user);
      });
    });
  }
}
