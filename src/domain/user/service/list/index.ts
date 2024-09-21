import type { Database } from '@infra/database';
import { users } from '@schema/schema';

export const ListUsersMixin = ({ db }: { db: Database }) => ({
    list: () => {
        return db.select().from(users).execute();
    }
});
