import { selectUserSchema } from '@domain/user/schema';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

export const UserRestAPI: FastifyPluginCallbackZod = (fastify, _, done) => {
    const userService = fastify.diContainer.resolve('user_service');

    fastify.route({
        url: '/v1/user',
        method: 'GET',
        schema: {
            response: {
                200: selectUserSchema.array()
            }
        },
        handler: async (_, reply) => {
            return reply.code(200).send(await userService.list());
        }
    });

    done();
};
