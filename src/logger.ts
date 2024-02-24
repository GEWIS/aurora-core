import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.LOG_LEVEL,
});

export default logger;
