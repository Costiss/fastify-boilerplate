import type { FastifyInstance } from 'fastify';
import { beforeEach, describe, expect, test } from 'vitest';
import fastify from 'fastify';
import { HealthcheckRoute } from '.';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';

describe('[UNIT] FastifyHealthcheckPlugin', () => {
    let server: FastifyInstance;

    beforeEach(async () => {
        server = fastify();
        server.setValidatorCompiler(validatorCompiler);
        server.setSerializerCompiler(serializerCompiler);

        await server.register(HealthcheckRoute);
    });

    test('it should hit healthcheck endpoint', () => {
        server.inject(
            {
                method: 'GET',
                url: '/healthcheck'
            },
            (error, response) => {
                expect(error).toBe(null);
                expect(response?.json()).toEqual({ status: 'ok' });
                expect(response?.statusCode).toBe(200);
            }
        );
    });
});
