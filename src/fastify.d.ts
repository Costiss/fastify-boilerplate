import '@fastify/awilix';
import { AwilixContainer } from 'awilix';
import type { Database } from './infra/database';
import type { InfraCradle } from './infra';

declare module '@fastify/awilix' {
    interface Cradle {
        db: Database;
        infra: AwilixContainer<InfraCradle>;
    }
}
