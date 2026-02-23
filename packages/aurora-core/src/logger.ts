import { createPinoLogger } from '@gewis/aurora-logger';
import { LOGGER_TOKEN, ILogger, registerLogger, resolveLogger } from './ports/logger.port';

const pinoInstance = createPinoLogger();

const logger: ILogger = {
  trace: pinoInstance.trace.bind(pinoInstance),
  debug: pinoInstance.debug.bind(pinoInstance),
  info: pinoInstance.info.bind(pinoInstance),
  warn: pinoInstance.warn.bind(pinoInstance),
  error: pinoInstance.error.bind(pinoInstance),
  fatal: pinoInstance.fatal.bind(pinoInstance),
  audit: () => {},
};

registerLogger(logger);

export { LOGGER_TOKEN, ILogger, registerLogger, resolveLogger };
export default logger;
