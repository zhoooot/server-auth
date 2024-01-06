import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';
import { SALT_ROUNDS } from 'src/config';
import { JwtDto } from 'src/common/dtos/payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async hashPassword(password: string): Promise<string> {
    return await hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }

  async validateJwtPayload(payload: JwtDto): Promise<any> {
    const user = await this.em.findOne(User, {
      auth_id: payload.sub,
      email: payload.email,
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.em.findOne(User, {
      email,
    });

    if (!user) {
      return null;
    }

    const isValid = await this.comparePassword(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async register(email: string, password: string) {
    const user = await this.em.findOne(User, {
      email,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.em.create(User, {
      email,
      password: await this.hashPassword(password),
      role: UserRole.USER,
    });

    await this.em.persistAndFlush(newUser);

    return newUser;
  }
}
