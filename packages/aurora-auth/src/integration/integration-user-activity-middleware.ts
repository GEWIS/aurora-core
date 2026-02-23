import { NextFunction, Request, Response } from 'express';
import { resolveDataSource } from '@gewis/aurora-core/ports/data-source';
import { IntegrationUser } from './entities/index';

export default async function IntegrationUserActivityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user && req.user.integrationUserId) {
    const repo = resolveDataSource().getRepository(IntegrationUser);
    await repo.update(req.user.integrationUserId, {
      lastSeen: new Date(),
    });
  }
  next();
}
