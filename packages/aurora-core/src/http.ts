import bodyParser from 'body-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { pinoHttp } from 'pino-http';
import { RegisterRoutes } from '../build/routes';
import apiDocs from '../build/swagger.json';
import { SessionMiddleware } from './modules/auth';
import { setupErrorHandler } from './error';
import { authResponse } from './modules/auth/passport';
import { merge, isErrorResult, MergeResult } from 'openapi-merge';
import { Swagger } from 'atlassian-openapi';
import { AuroraConfig } from '@gewis/aurora-core-util';

const origins = process.env.CORS_ORIGINS?.split(', ');
export const enableCors = origins !== undefined && origins.length > 0;

export function customOrigin(
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: boolean | string | RegExp | (boolean | string | RegExp)[]) => void,
) {
  if (origins && origins.length > 0) {
    callback(null, origins);
  } else {
    callback(new Error('No origins defined'), requestOrigin);
  }
}

/**
 * Create an Express instance to listen to HTTP calls.
 * Directly assigns all middlewares and routes.
 *
 * HTTP is only used for the end user to interact with the software,
 * i.e. changing settings or modes.
 */
export default async function createHttp(config: AuroraConfig): Promise<express.Express> {
  if (config.auth.length === 0) {
    throw new Error('No authentication plugins found. Please add at least one authentication plugin.');
  }

  const app = express();

  app.use(
    pinoHttp({
      useLevel: 'debug',
    }),
  );

  app.use(
    cors({
      allowedHeaders: ['Cookie', 'Cookies'],
      origin: enableCors ? customOrigin : undefined,
    }),
  );

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(bodyParser.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(SessionMiddleware.getInstance().get());

  app.use(passport.initialize());
  app.use(passport.session());

  RegisterRoutes(app);
  for (const plugin of config.auth) {
    if ((plugin.devOnly && process.env.NODE_ENV === 'development') || !plugin.devOnly) {
      plugin.RegisterRoutes(app);
    }
  }

  app.post('/api/auth/oidc', passport.authenticate('oidc'), authResponse);
  app.post('/api/auth/key', passport.authenticate('apikey'), authResponse);

  let mergedSpecs: MergeResult;
  let currentSpecs = apiDocs as Swagger.SwaggerV3;
  for (const plugin of config.auth) {
    if ((plugin.devOnly && process.env.NODE_ENV === 'development') || !plugin.devOnly) {
      mergedSpecs = merge([{ oas: currentSpecs }, { oas: plugin.Specs as Swagger.SwaggerV3 }]);

      if (isErrorResult(mergedSpecs)) {
        throw new Error('Overlapping routes found.');
      } else {
        currentSpecs = mergedSpecs.output;
      }
    }
  }

  app.use('/api-docs', swaggerUi.serveFiles(currentSpecs), swaggerUi.setup(currentSpecs));

  for (const plugin of config.auth) {
    if ((plugin.devOnly && process.env.NODE_ENV === 'development') || !plugin.devOnly) {
      plugin.RegisterStrategy();
    }
  }

  if (process.env.NODE_ENV === 'development') {
    app.use('/static', express.static('public'));
  }

  setupErrorHandler(app);
  return app;
}
