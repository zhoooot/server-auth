import { Role } from '@prisma/client';
import * as Joi from 'joi';

export class SignupDto {
  email: string;
  password: string;
  role: Role;
}

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().valid(Role.ADMIN, Role.USER).required(),
});
