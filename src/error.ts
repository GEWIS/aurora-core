import {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction, Express,
} from 'express';
import { ValidateError } from 'tsoa';

export function setupErrorHandler(app : Express) {
  app.use((_req, res: ExResponse) => {
    res.status(404).send({
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
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }

    // if (err instanceof ApiError) {
    //   return res.status(err.statusCode).json({
    //     message: err.name,
    //     details: err.message,
    //   });
    // }

    next();
  });
}
