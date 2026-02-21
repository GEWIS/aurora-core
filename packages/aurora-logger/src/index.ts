import pino from 'pino';

export const createPinoLogger = () => {
  const base = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    level: process.env.LOG_LEVEL || 'info',
    customLevels: {
      audit: 39,
    },
  });

  return base;
};
