import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import type { GlobalSetupContext } from 'vitest/node';
import path from 'path';
import * as schema from '@schema/schema';

export default async function setup({ provide }: GlobalSetupContext) {
    const [pgUrl] = await Promise.all([startPsqlContainer()]);
    provide('pgUrl', pgUrl);

    await migrateDb(pgUrl);

    process.env.DATABASE_URL = pgUrl;
}

declare module 'vitest' {
    export interface ProvidedContext {
        pgUrl: string;
        pubsubUrl: { apiEndpoint: string; port: number };
    }
}

async function startPsqlContainer() {
    console.log('starting psql container...');
    return new PostgreSqlContainer()
        .withUser('postgres')
        .withUsername('postgres')
        .withDatabase('postgres')
        .start()
        .then((pg) => pg.getConnectionUri());
}

async function migrateDb(connectionString: string) {
    console.log('migrating db...');

    const pgClient = new Client({ connectionString });
    await pgClient.connect();
    const db = drizzle(pgClient, { schema });
    await migrate(db, {
        migrationsFolder: path.join(__dirname, '../../../migrations'),
        migrationsSchema: 'public'
    });
    await pgClient.end();
}
