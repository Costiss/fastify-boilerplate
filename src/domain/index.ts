import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { UserDomain } from './user';

export const DomainApp: FastifyPluginAsyncZod = async (fastify) => {
    await fastify.register(UserDomain);
};
