import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidateGuard implements CanActivate {
  constructor(private readonly schema: z.ZodObject<any>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const body = request.body;

    try {
      await this.schema.parseAsync(body);
      return true;
    } catch (err) {
      throw new ForbiddenException(err.issues);
    }
  }
}
