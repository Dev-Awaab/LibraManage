import knex, { Knex } from 'knex'
import * as pg from 'pg';
import Config from '../config';
import logger from '../log';
import { UnknownObject } from 'src/types';

interface DatabaseAdapterOptions {
    host: string;
    user: string;
    password: string;
    database: string;
    pool?: { min: number; max: number };
}

export const connection: DatabaseAdapterOptions = {
    host: Config.databaseHost,
    user: Config.databaseUser,
    password: Config.databasePassword,
    database: Config.databaseName,
};

// 20 is the value of the result of SELECT oid FROM pg_type WHERE typname = 'int8';
// parse bigint as number
pg.types.setTypeParser(20, function (value) {
    return parseInt(value);
});

// parse numeric  as number
pg.types.setTypeParser(1700, function (value) {
    return parseFloat(value);
});

export function createPgAdapter(connection: DatabaseAdapterOptions): Knex {
    const config: Knex.Config = {
        client: 'pg',
        connection,
        pool: connection.pool || {
            min: Config.nodeEnv === 'test' ? 0 : 3,
            max: Config.nodeEnv === 'test' ? 1 : 10,
        },
        debug: Config.nodeEnv === 'development', // 'local'?
        asyncStackTraces: Config.nodeEnv !== 'production',
        useNullAsDefault: true,
        searchPath: [Config.databaseSchema, 'public'],
        log: {
            warn(message: UnknownObject) {
                logger.info(message, '[KNEX][WARN]');
            },
            error(message: Error) {
                logger.error(message, '[KNEX][ERROR]');
            },
            deprecate(message: any) {
                logger.info({ message }, '[KNEX][DEPRECATE]');
            },
            debug(message: UnknownObject) {
                logger.info(message, '[KNEX][DEBUG]');
            },
        },
    };

    return knex(config);
}