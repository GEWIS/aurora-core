import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { LOGGER_TOKEN, ILogger, registerLogger, resolveLogger } from './logger.port';

beforeEach(() => {
  container.clearInstances();
});

const makeStubLogger = (): ILogger => ({
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  audit: vi.fn(),
});

describe('registerLogger', () => {
  it('registers the logger in the container', () => {
    const stub = makeStubLogger();
    registerLogger(stub);

    expect(container.isRegistered(LOGGER_TOKEN)).toBe(true);
  });

  it('returns the registered logger', () => {
    const stub = makeStubLogger();
    const result = registerLogger(stub);

    expect(result).toBe(stub);
  });

  it('allows replacing the registered logger', () => {
    const first = makeStubLogger();
    const second = makeStubLogger();

    registerLogger(first);
    registerLogger(second);

    expect(resolveLogger()).toBe(second);
  });
});

describe('resolveLogger', () => {
  it('throws when no logger has been registered', () => {
    expect(() => resolveLogger()).toThrowError(
      'No logger registered. Register one before starting the application.',
    );
  });

  it('returns the registered logger', () => {
    const stub = makeStubLogger();
    registerLogger(stub);

    expect(resolveLogger()).toBe(stub);
  });

  it('returns a logger with all required ILogger methods', () => {
    const stub = makeStubLogger();
    registerLogger(stub);

    const resolved = resolveLogger();

    expect(typeof resolved.trace).toBe('function');
    expect(typeof resolved.debug).toBe('function');
    expect(typeof resolved.info).toBe('function');
    expect(typeof resolved.warn).toBe('function');
    expect(typeof resolved.error).toBe('function');
    expect(typeof resolved.fatal).toBe('function');
    expect(typeof resolved.audit).toBe('function');
  });

  it('resolved logger methods are callable', () => {
    const stub = makeStubLogger();
    registerLogger(stub);

    const resolved = resolveLogger();

    expect(() => resolved.info('test message')).not.toThrow();
    expect(stub.info).toHaveBeenCalledWith('test message');
  });
});
