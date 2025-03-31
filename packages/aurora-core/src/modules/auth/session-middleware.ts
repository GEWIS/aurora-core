import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Session } from './entities';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util';

export default class SessionMiddleware {
  private static instance: SessionMiddleware;

  private readonly middleware: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

  constructor() {
    this.middleware = session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        limitSubquery: false, // MariaDB
      }).connect(DataSourceSingleton.getInstance().get().getRepository(Session)),
    });
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SessionMiddleware();
    }
    return this.instance;
  }

  public get() {
    return this.middleware;
  }
}
