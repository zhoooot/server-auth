import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create_user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: await this.hashPassword(data.password),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async removeUser(id: string) {
    return this.prisma.user.delete({
      where: {
        auth_id: id,
      },
    });
  }
}
