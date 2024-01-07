import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
export const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export const SALT_ROUNDS = 10;

export default {
  DATABASE_URL,
};
