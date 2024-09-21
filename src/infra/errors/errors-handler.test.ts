import type { FastifyInstance } from 'fastify';
import { beforeEach, describe, expect, test } from 'vitest';
import fastify from 'fastify';
import { ErrorsHandlerFastifyPlugin } from '.';
import { HttpError } from './http-error';
import { z } from 'zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

describe('[UNIT] FastifyErrorsHandlerPlugin', () => {
    let server: FastifyInstance;

    beforeEach(async () => {
        server = fastify();
        server.setValidatorCompiler(validatorCompiler);
        server.setSerializerCompiler(serializerCompiler);

        await server.register(ErrorsHandlerFastifyPlugin);
    });

    test('it should handle HttpError without payload correctly', () => {
        server.get('/', () => {
            throw new HttpError(409, 'Entity already exists');
        });

        server.inject(
            {
                method: 'GET',
                url: '/'
            },
            (_, response) => {
                expect(response?.statusCode).toBe(409);
                expect(response?.body).toEqual('{"message":"Entity already exists"}');
            }
        );
    });

    test('it should handle HttpError with payload correctly', () => {
        server.get('/', () => {
            throw new HttpError(501, 'Custom Error', 'CUSTOM_ERROR', {
                custom: 'message'
            });
        });

        server.inject(
            {
                method: 'GET',
                url: '/'
            },
            (_, response) => {
                expect(response?.statusCode).toBe(501);
                expect(response?.json()).toEqual({
                    custom: 'message',
                    message: 'Custom Error',
                    code: 'CUSTOM_ERROR'
                });
            }
        );
    });

    test('it should handle ZodError correctly', () => {
        server.route({
            method: 'POST',
            url: '/',
            schema: {
                body: z.object({ number: z.number() })
            },
            handler: async (_, res) => res.code(200)
        });

        server.inject(
            {
                method: 'POST',
                url: '/',
                body: { number: 'not a number' }
            },
            (_, response) => {
                expect(response?.statusCode).toBe(400);
                expect(response?.json()).toEqual([
                    {
                        code: 'invalid_type',
                        expected: 'number',
                        received: 'string',
                        path: ['number'],
                        message: 'Expected number, received string'
                    }
                ]);
            }
        );
    });

    test('it should handle other errors correctly', () => {
        server.route({
            method: 'GET',
            url: '/',
            handler: () => {
                throw new Error('some error');
            }
        });

        server.inject(
            {
                method: 'GET',
                url: '/'
            },
            (_, response) => {
                expect(response?.statusCode).toBe(500);
                expect(response?.json()).toEqual({
                    message: 'some error',
                    name: 'Error'
                });
            }
        );
    });
});
