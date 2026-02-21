import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import {
  DB_DATA_SOURCE_TOKEN,
  IDataSource,
  registerDataSource,
  resolveDataSource,
} from './data-source.port';

beforeEach(() => {
  container.clearInstances();
});

const makeStubDataSource = (): IDataSource => ({
  getRepository: () => ({}) as any,
  transaction: async (fn) => fn({} as any),
  manager: {} as any,
});

describe('registerDataSource', () => {
  it('registers the data source in the container', () => {
    const stub = makeStubDataSource();
    registerDataSource(stub);

    expect(container.isRegistered(DB_DATA_SOURCE_TOKEN)).toBe(true);
  });

  it('returns the registered data source', () => {
    const stub = makeStubDataSource();
    const result = registerDataSource(stub);

    expect(result).toBe(stub);
  });

  it('allows replacing the registered data source', () => {
    const first = makeStubDataSource();
    const second = makeStubDataSource();

    registerDataSource(first);
    registerDataSource(second);

    expect(resolveDataSource()).toBe(second);
  });
});

describe('resolveDataSource', () => {
  it('throws when no data source has been registered', () => {
    expect(() => resolveDataSource()).toThrowError(
      'No database DataSource registered. Register one before starting the application.',
    );
  });

  it('returns the registered data source', () => {
    const stub = makeStubDataSource();
    registerDataSource(stub);

    expect(resolveDataSource()).toBe(stub);
  });

  it('returns an object satisfying the IDataSource interface', () => {
    const stub = makeStubDataSource();
    registerDataSource(stub);

    const resolved = resolveDataSource();

    expect(typeof resolved.getRepository).toBe('function');
    expect(typeof resolved.transaction).toBe('function');
    expect(resolved.manager).toBeDefined();
  });
});
