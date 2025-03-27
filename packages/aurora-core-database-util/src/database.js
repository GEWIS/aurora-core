"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceSingleton = void 0;
const typeorm_1 = require("typeorm");
const fs_1 = __importDefault(require("fs"));
class DataSourceSingleton {
    static instance;
    initialized = false;
    dataSource;
    createDataSource(entities) {
        return new typeorm_1.DataSource({
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
            database: process.env.TYPEORM_DATABASE,
            type: process.env.TYPEORM_CONNECTION,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            ...(process.env.TYPEORM_SSL_ENABLED === 'true' && process.env.TYPEORM_SSL_CACERTS
                ? {
                    ssl: {
                        ca: fs_1.default.readFileSync(process.env.TYPEORM_SSL_CACERTS),
                    },
                }
                : {}),
            synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
            logging: process.env.TYPEORM_LOGGING === 'true',
            extra: {
                authPlugins: {
                    mysql_clear_password: () => () => Buffer.from(`${process.env.TYPEORM_PASSWORD}\0`),
                },
            },
            entities: entities
        });
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DataSourceSingleton();
        }
        return this.instance;
    }
    get() {
        return this.dataSource;
    }
    async initialize(entities) {
        if (this.initialized) {
            throw new Error('DataSource already initialized!');
        }
        this.dataSource = this.createDataSource(entities);
        await this.dataSource.initialize();
        this.initialized = true;
    }
}
exports.DataSourceSingleton = DataSourceSingleton;
//# sourceMappingURL=database.js.map