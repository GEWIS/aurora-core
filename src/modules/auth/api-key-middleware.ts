import { NextFunction, Request, Response } from 'express';
import dataSource from '../../database';
import { ApiKey } from './entities';
import logger from '../../logger';
import { IntegrationUser } from './integration/entities';

async function updateLastSeen(integrationUser: IntegrationUser) {
  const repo = dataSource.getRepository(IntegrationUser);
  await repo.update(integrationUser.id, {
    lastSeen: new Date(),
  });
}

export default async function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  // User already found, so nothing for us to do here
  if (req.user) next();

  const rawKey = req.headers['x-authorization'];
  if (!rawKey) {
    next();
    return;
  }

  // Format the key to the appropriate format
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
    // Find the user in the database
    const identity = await dataSource.getRepository(ApiKey).findOne({ where: { key } });
    if (identity) {
      req.user = identity.asAuthUser();
      if (identity.integrationUser) {
        void updateLastSeen(identity.integrationUser);
      }
    }
  } catch (e) {
    logger.error(e);
  } finally {
    // Always continue
    next();
  }
}
