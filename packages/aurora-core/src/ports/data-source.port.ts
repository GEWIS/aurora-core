import { EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { container } from 'tsyringe';

export const DB_DATA_SOURCE_TOKEN = Symbol('AuroraDbDataSource');

export interface IDataSource {
  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity>;
  transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
  manager: EntityManager;
}

export const registerDataSource = (dataSource: IDataSource): IDataSource => {
  container.registerInstance(DB_DATA_SOURCE_TOKEN, dataSource);
  return dataSource;
};

export const resolveDataSource = (): IDataSource => {
  if (!container.isRegistered(DB_DATA_SOURCE_TOKEN)) {
    throw new Error(
      'No database DataSource registered. Register one before starting the application.',
    );
  }
  return container.resolve<IDataSource>(DB_DATA_SOURCE_TOKEN);
};
