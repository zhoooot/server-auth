import { DATABASE_URL } from './config';

import { Options } from '@mikro-orm/mysql';
import { User } from './entities/user.entity';

export const config: Options = {
  type: 'mysql',
  clientUrl: DATABASE_URL,
  entities: [User],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
