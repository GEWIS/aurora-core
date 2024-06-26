import { Controller, Queries } from '@tsoa/runtime';
import { Get, Route, Security, Tags } from 'tsoa';
import AuditService, { GetAuditLogEntryParams } from './audit-service';

@Tags('Audit Logs')
@Route('audit-logs')
export class AuditController extends Controller {
  @Get()
  @Security('local', ['*'])
  public getAuditLogs(@Queries() params: GetAuditLogEntryParams) {
    const queryParams = {
      ...params,
      take: params.take ?? 50,
    };
    return new AuditService().getLogs(queryParams);
  }
}
