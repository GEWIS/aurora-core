import { NextFunction, Request, Response } from 'express';
import { resolveDataSource } from '@gewis/aurora-core/ports/data-source';
import { resolveLogger } from '@gewis/aurora-core/ports/logger';
import { ApiKey } from './entities/index';

export default async function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next();
    return;
  }

  const rawKey = req.headers['x-api-key'];
  if (!rawKey) {
    next();
    return;
  }

  let key: string;
  if (Array.isArray(rawKey)) {
    if (rawKey.length !== 1) {
      next();
      return;
    }
    key = rawKey[0];
  } else {
    key = rawKey;
  }

  try {
    const identity = await resolveDataSource().getRepository(ApiKey).findOne({ where: { key } });
    if (identity) {
      req.user = identity.asAuthUser();
    }
  } catch (e) {
    resolveLogger().error(e);
  } finally {
    next();
  }
}
