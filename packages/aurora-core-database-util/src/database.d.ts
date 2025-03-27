import { DataSource } from 'typeorm';
export declare class DataSourceSingleton {
    private static instance;
    private initialized;
    private dataSource;
    private createDataSource;
    static getInstance(): DataSourceSingleton;
    get(): DataSource;
    initialize(entities: any[]): Promise<void>;
}
