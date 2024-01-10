import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { EntityManager } from '@mikro-orm/mysql';
import { SALT_ROUNDS } from 'src/config';
import { JwtDto } from 'src/common/dtos/payload.dto';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

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

  async findUserByEmail(email: string) {
    return await this.em.findOne(User, {
      email,
    });
  }

  async changePassword(email: string, newPassword: string) {
    const user = await this.em.findOne(User, {
      email,
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    user.password = await this.hashPassword(newPassword);

    await this.em.persistAndFlush(user);

    return user;
  }

  @RabbitSubscribe({
    exchange: 'user',
    routingKey: 'user.delete',
  })
  async removeUser(auth_id: string) {
    const user = await this.em.findOne(User, {
      auth_id: auth_id,
    });

    await this.em.removeAndFlush(user);
    return user;
  }
}
