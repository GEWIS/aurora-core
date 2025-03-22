import { Controller, Queries } from '@tsoa/runtime';
import { Get, Route, Security, Tags } from 'tsoa';
import AuditService, { GetAuditLogEntryParams } from './audit-service';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';

@Tags('Audit Logs')
@Route('audit-logs')
export class AuditController extends Controller {
  @Get()
  @Security(SecurityNames.LOCAL, securityGroups.audit.base)
  public async getAuditLogs(@Queries() params: GetAuditLogEntryParams) {
    const queryParams = {
      ...params,
      take: params.take ?? 50,
    };
    return new AuditService().getLogs(queryParams);
  }
}
