import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '../jwt.service';
import { jwtDtoSchema } from 'src/common/dtos/payload.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const raw = request.headers['authorization'];

    if (!raw) {
      return false;
    }

    const [bearer, token] = raw.split(' ');

    if (bearer !== 'Bearer') {
      return false;
    }

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verify(token);

      const user = await jwtDtoSchema.parseAsync(payload);

      if (user.iat >= user.exp) {
        return false;
      }

      if (user.exp < Date.now()) {
        return false;
      }

      request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
