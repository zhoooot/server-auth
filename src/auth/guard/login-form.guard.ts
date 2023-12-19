import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoginDto } from '../dto/login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LoginFormGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const body = context.switchToHttp().getRequest().body;
    const { email, password } = body;

    const dto = plainToClass(LoginDto, { email, password });
    const errors = await validate(dto);

    if (errors.length) {
      throw new BadRequestException('Form data validation failed');
    }

    return true;
  }
}
