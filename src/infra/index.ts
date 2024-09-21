import { DatabaseFastifyPlugin } from './database';
import { ErrorsHandlerFastifyPlugin } from './errors';
import { HealthcheckRoute } from './healthcheck';
import { LoggerFastifyPlugin } from './logger/plugin';
import { OpenAPIFastifyPlugin } from './openapi';
import { fastifyAwilixPlugin as DIFastifyPlugin, type Cradle } from '@fastify/awilix';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import '@fastify/awilix';
import fp from 'fastify-plugin';
import { asFunction, createContainer } from 'awilix';

export type InfraCradle = {
    //infra modules
};

const RegisterInfraContainer = (_: Cradle) => {
    const container = createContainer<InfraCradle>();
    return container.register({
        //infra modules injection
    });
};

export const InfraestructurePlugin = fp(async (fastify) => {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
    await fastify.register(DIFastifyPlugin);
    await fastify.register(DatabaseFastifyPlugin);
    await fastify.register(OpenAPIFastifyPlugin);
    await fastify.register(LoggerFastifyPlugin);
    await fastify.register(ErrorsHandlerFastifyPlugin);
    await fastify.register(HealthcheckRoute);

    fastify.diContainer.register({
        infra: asFunction(RegisterInfraContainer, { eagerInject: true, lifetime: 'SINGLETON' })
    });
});
