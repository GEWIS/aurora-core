import {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction, Express,
} from 'express';
import { ValidateError } from 'tsoa';
import { ApiError, HttpStatusCode } from './helpers/customError';
import logger from './logger';

export function setupErrorHandler(app : Express) {
  app.use((req: ExRequest, res: ExResponse) => {
    res.status(HttpStatusCode.NotFound).send({
      message: 'Not Found',
    });
  });

  app.use((
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction,
  ): ExResponse | void => {
    if (err instanceof ValidateError) {
      logger.warn(`Caught '${HttpStatusCode.BadRequest} - Bad Request' for ${req.path}.`);
      return res.status(HttpStatusCode.BadRequest).json({
        message: 'Bad Request',
        details: err?.fields,
      });
    }

    if (err instanceof ApiError) {
      logger.warn(`Caught '${err.statusCode} - ${err.name}' for ${req.path}.`);
      return res.status(err.statusCode).json({
        message: err.name,
        details: err.message,
      });
    }

    next();
    return undefined;
  });
}
