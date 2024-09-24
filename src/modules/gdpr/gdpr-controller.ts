import { Controller } from '@tsoa/runtime';
import { Get, Route, Security, Tags } from 'tsoa';
import { SecurityGroup } from '../../helpers/security';
import GdprService from './gdpr-service';

@Tags('GDPR')
@Route('gdpr')
export class GdprController extends Controller {
  @Get('personal-data/{userId}')
  @Security('local', [SecurityGroup.ADMIN])
  public getPersonalData(userId: string) {
    return new GdprService().getPersonalData(userId);
  }
}
