import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './entities';
import dataSource from '../../database';

export function getSessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: new TypeormStore({
      limitSubquery: false, // MariaDB
    }).connect(dataSource.getRepository(Session)),
  });
}
