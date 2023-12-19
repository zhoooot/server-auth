import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as Joi from 'joi';
import { Observable } from 'rxjs';

@Injectable()
export class JoiGuard implements CanActivate {
  constructor(private readonly schema: Joi.Schema) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const body = context.switchToHttp().getRequest().body;
    const { error } = this.schema.validate(body);

    if (error) {
      const errors = error.details.map((err) => err.message);

      throw new BadRequestException(errors);
    }

    return true;
  }
}
