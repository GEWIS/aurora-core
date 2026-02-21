import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { DataSource, EntitySchema } from 'typeorm';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { createSqliteDataSource } from './index';

interface TestEntity {
  id: number;
  name: string;
}

const TestEntitySchema = new EntitySchema<TestEntity>({
  name: 'TestEntity',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String },
  },
});

const inMemoryOptions = { type: 'better-sqlite3' as const, database: ':memory:' };

describe('factory', () => {
  it('returns a DataSource instance', () => {
    const dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: inMemoryOptions,
    });

    expect(dataSource).toBeInstanceOf(DataSource);
  });

  it('returns independent instances on each call', () => {
    const a = createSqliteDataSource({ entities: [TestEntitySchema], options: inMemoryOptions });
    const b = createSqliteDataSource({ entities: [TestEntitySchema], options: inMemoryOptions });

    expect(a).not.toBe(b);
  });
});

describe('initialization', () => {
  let dataSource: DataSource | undefined;

  afterEach(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    dataSource = undefined;
  });

  it('initializes successfully with an in-memory database', async () => {
    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: { ...inMemoryOptions, synchronize: true },
    });

    await dataSource.initialize();

    expect(dataSource.isInitialized).toBe(true);
  });

  it('can perform CRUD after initialization', async () => {
    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: { ...inMemoryOptions, synchronize: true },
    });

    await dataSource.initialize();

    const repo = dataSource.getRepository<TestEntity>(TestEntitySchema);
    const saved = await repo.save({ name: 'hello' });

    expect(saved.id).toBeDefined();
    expect(saved.name).toBe('hello');

    const found = await repo.findOne({ where: { id: saved.id } });
    expect(found?.name).toBe('hello');
  });

  it('supports transactions', async () => {
    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: { ...inMemoryOptions, synchronize: true },
    });

    await dataSource.initialize();

    const saved = await dataSource.transaction(async (manager) => {
      return manager.save(TestEntitySchema, { name: 'transactional' });
    });

    expect(saved.name).toBe('transactional');
  });
});

describe('options', () => {
  let dataSource: DataSource | undefined;

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    dataSource = undefined;
  });

  it('applies options overrides', () => {
    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: { ...inMemoryOptions, logging: true },
    });

    expect((dataSource.options as any).logging).toBe(true);
  });

  it('options override takes precedence over base env options', () => {
    vi.stubEnv('TYPEORM_SYNCHRONIZE', 'true');

    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: { ...inMemoryOptions, synchronize: false },
    });

    expect((dataSource.options as any).synchronize).toBe(false);
  });

  it('reads synchronize and logging from environment variables', () => {
    vi.stubEnv('TYPEORM_SYNCHRONIZE', 'true');
    vi.stubEnv('TYPEORM_LOGGING', 'true');

    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: inMemoryOptions,
    });

    expect((dataSource.options as any).synchronize).toBe(true);
    expect((dataSource.options as any).logging).toBe(true);
  });
});

describe('ssl', () => {
  let dataSource: DataSource | undefined;

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
    dataSource = undefined;
  });

  it('includes ssl config when TYPEORM_SSL_ENABLED and TYPEORM_SSL_CACERTS are set', () => {
    const certPath = join(__dirname, 'test-ca.pem');
    writeFileSync(certPath, 'fake-cert-content');

    vi.stubEnv('TYPEORM_SSL_ENABLED', 'true');
    vi.stubEnv('TYPEORM_SSL_CACERTS', certPath);

    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: inMemoryOptions,
    });

    expect((dataSource.options as any).ssl?.ca).toBeDefined();

    unlinkSync(certPath);
  });

  it('omits ssl config when TYPEORM_SSL_ENABLED is not true', () => {
    vi.stubEnv('TYPEORM_SSL_ENABLED', 'false');

    dataSource = createSqliteDataSource({
      entities: [TestEntitySchema],
      options: inMemoryOptions,
    });

    expect((dataSource.options as any).ssl).toBeUndefined();
  });
});
