import type { FastifyInstance } from 'fastify';
import { describe, expect, test } from 'vitest';
import fastify from 'fastify';
import { DatabaseFastifyPlugin } from '.';
import { fastifyAwilixPlugin as DIFastifyPlugin } from '@fastify/awilix';

describe('[UNIT] FastifyDatabasePlugin', () => {
    let server: FastifyInstance;

    test('it should connect to db', async () => {
        server = fastify();
        await server.register(DIFastifyPlugin);
        await server.register(DatabaseFastifyPlugin);

        const db = server.diContainer.resolve('db');
        expect(db).toBeDefined();
    });
});
