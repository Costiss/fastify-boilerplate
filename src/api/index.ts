import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UserRestAPI } from './user';

export const RestAPIModule: FastifyPluginAsyncZod = async (fastify) => {
    await fastify.register(UserRestAPI);
};
