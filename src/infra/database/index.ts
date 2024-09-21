import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import fp from 'fastify-plugin';
import * as schema from '@schema/schema';
import { asFunction } from 'awilix';
import { getEnv } from 'src/utils/env.utils';

async function getDatabase(connectionString: string) {
    const client = new pg.Pool({
        connectionString,
        max: 5,
        min: 1,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        allowExitOnIdle: true,
        maxUses: 50
    });

    const db = drizzle(client, { schema });
    await client.connect();
    return { db, client };
}

export type Database = Awaited<ReturnType<typeof getDatabase>>['db'];

export const DatabaseFastifyPlugin = fp(async (fastify) => {
    try {
        const { db } = await getDatabase(getEnv('DATABASE_URL'));
        fastify.diContainer.register({ db: asFunction(() => db) });
    } catch (error) {
        fastify.log.error(error);
        fastify.diContainer.register({ db: asFunction(() => null as never) });
    }
});
