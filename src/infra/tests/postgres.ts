import { Client } from 'pg';
import * as schema from '@schema/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { inject } from 'vitest';

export type TestDatabase = Awaited<ReturnType<typeof getTestDatabase>>;

export async function getTestDatabase() {
    const connectionString = inject('pgUrl');
    const pgClient = new Client({ connectionString });
    await pgClient.connect();

    const db = drizzle(pgClient, { schema });

    const cleanup = async () => {
        await pgClient.end();
    };

    return { db, pgClient, cleanup };
}
