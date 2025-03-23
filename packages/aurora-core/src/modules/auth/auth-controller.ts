import { Controller } from '@tsoa/runtime';
import { Get, Route, Tags } from 'tsoa';
import { ISecurityGroups, typedSecurityGroups } from '@gewis/aurora-core-util';

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  /**
   * Returns the security groups
   */
  @Get('groups')
  public getSecurityGroups(): ISecurityGroups {
    return typedSecurityGroups;
  }
}
