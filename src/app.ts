import Fastify from 'fastify';
import { Logger } from './infra/logger';
import { DomainApp } from './domain';
import { InfraestructurePlugin } from './infra';
import { RestAPIModule } from './api';

export default async function getServer() {
    const server = Fastify({ logger: Logger, disableRequestLogging: true });

    await server.register(InfraestructurePlugin);
    await server.register(DomainApp);
    await server.register(RestAPIModule);

    return server;
}
