import type { Database } from '@infra/database';
import { ListUsersMixin } from './list';

export type UserService = ReturnType<typeof getUserService>;

export const getUserService = ({ db }: { db: Database }) => ({
    ...ListUsersMixin({ db })
});
