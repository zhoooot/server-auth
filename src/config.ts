import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
export const GOOGLE_MAILER_CLIENT_SECRET =
  process.env.GOOGLE_MAILER_CLIENT_SECRET;
export const GOOGLE_MAILER_REFRESH_TOKEN =
  process.env.GOOGLE_MAILER_REFRESH_TOKEN;
export const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
export const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export const SALT_ROUNDS = 10;

export const RABBITMQ_URL = process.env.RABBITMQ_URL;
