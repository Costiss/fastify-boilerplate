import '@fastify/awilix';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { getUserService, type UserService } from './service';
import { asFunction } from 'awilix';
import type { Cradle } from '@fastify/awilix';

declare module '@fastify/awilix' {
    interface Cradle {
        user_service: UserService;
    }
}

export const UserDomain: FastifyPluginCallbackZod = (fastify, _, done) => {
    fastify.diContainer.register({
        user_service: asFunction(({ db }: Cradle) => {
            return getUserService({ db });
        })
    });
    done();
};
