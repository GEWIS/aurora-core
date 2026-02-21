import { container } from 'tsyringe';

export const LOGGER_TOKEN = Symbol('AuroraLogger');

export interface ILogger {
  trace(obj: unknown, msg?: string, ...args: any[]): void;
  trace(msg: string, ...args: any[]): void;
  debug(obj: unknown, msg?: string, ...args: any[]): void;
  debug(msg: string, ...args: any[]): void;
  info(obj: unknown, msg?: string, ...args: any[]): void;
  info(msg: string, ...args: any[]): void;
  warn(obj: unknown, msg?: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(obj: unknown, msg?: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
  fatal(obj: unknown, msg?: string, ...args: any[]): void;
  fatal(msg: string, ...args: any[]): void;
  audit(user: unknown, msg?: string, ...args: any[]): void;
}

export const registerLogger = (logger: ILogger): ILogger => {
  container.registerInstance(LOGGER_TOKEN, logger);
  return logger;
};

export const resolveLogger = (): ILogger => {
  if (!container.isRegistered(LOGGER_TOKEN)) {
    throw new Error('No logger registered. Register one before starting the application.');
  }
  return container.resolve<ILogger>(LOGGER_TOKEN);
};
