import { DATABASE_URL } from './config';

import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Creator } from './entities/creator.entity';
import { Migrator } from '@mikro-orm/migrations';

export const config = {
  driver: PostgreSqlDriver,
  clientUrl: DATABASE_URL,
  entities: [User, Creator],
  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeds',
    pathTs: 'src/seeds',
  },
  pool: {
    max: 3,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 10000,
  },
  driverOptions: {
    connection: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    },
  },
};

export default config;
