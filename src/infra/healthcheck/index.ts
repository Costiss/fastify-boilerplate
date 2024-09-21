import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const OPENAPI_TAGS = ['infra'];

export const HealthcheckRoute: FastifyPluginCallbackZod = (fastify, _, done) => {
    fastify.route({
        url: '/healthcheck',
        method: 'GET',
        schema: {
            tags: OPENAPI_TAGS,
            response: {
                200: z.object({ status: z.string() })
            }
        },
        handler: async (_, reply) => {
            return reply.code(200).send({ status: 'ok' });
        }
    });
    done();
};
