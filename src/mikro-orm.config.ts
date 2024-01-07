import { DATABASE_URL } from './config';

import { Options } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';

export const config: Options = {
  type: 'postgresql',
  clientUrl: DATABASE_URL,
  entities: [User],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeds',
    pathTs: 'src/seeds',
  },
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;
