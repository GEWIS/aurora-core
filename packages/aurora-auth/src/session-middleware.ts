import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { resolveDataSource } from '@gewis/aurora-core/ports/data-source';
import { Session } from './entities/index';

export default class SessionMiddleware {
  private static instance: SessionMiddleware;

  private readonly middleware: RequestHandler<
    ParamsDictionary,
    any,
    any,
    ParsedQs,
    Record<string, any>
  >;

  constructor() {
    this.middleware = session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        limitSubquery: false,
      }).connect(resolveDataSource().getRepository(Session)),
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
