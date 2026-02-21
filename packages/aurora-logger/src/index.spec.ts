import { describe, it, expect, vi } from 'vitest';
import { createPinoLogger } from './index';

describe('log methods', () => {
  it('returns a logger with all standard log methods', () => {
    const logger = createPinoLogger();

    expect(typeof logger.trace).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.fatal).toBe('function');
  });

  it('exposes the audit custom level', () => {
    const logger = createPinoLogger();

    expect(logger.levels.values).toHaveProperty('audit');
  });
});

describe('log level', () => {
  it('sets the log level from LOG_LEVEL env variable', () => {
    vi.stubEnv('LOG_LEVEL', 'warn');
    const logger = createPinoLogger();

    expect(logger.level).toBe('warn');

    vi.unstubAllEnvs();
  });

  it('defaults to info when LOG_LEVEL is not set', () => {
    vi.unstubAllEnvs();
    const logger = createPinoLogger();

    expect(logger.level).toBe('info');
  });
});

describe('instances', () => {
  it('returns independent instances on each call', () => {
    const a = createPinoLogger();
    const b = createPinoLogger();

    expect(a).not.toBe(b);
  });
});
