import { NextFunction, Request, Response } from 'express';
import { resolveDataSource } from '../../../ports/data-source.port';
import { IntegrationUser } from './entities';

/**
 * Middleware to update the "last seen" field on the currently authenticated IntegrationUser.
 */
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
