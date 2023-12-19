import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { JwtPayLoad } from './dto/jwt-payload.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const user = await this.userService.createUser({
      email: data.email,
      password: data.password,
      role: data.role,
    });

    if (!user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    return {
      message: 'User created successfully',
      auth_id: user.auth_id,
      email: user.email,
      role: user.role,
    };
  }

  login(user: User) {
    const payload: JwtPayLoad = {
      auth_id: user.auth_id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateRefreshToken(user: JwtPayLoad) {
    const payload: JwtPayLoad = {
      auth_id: user.auth_id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.RT_SECRET,
      expiresIn: process.env.RT_EXPIRES_IN,
    });

    return refreshToken;
  }

  generateAccessToken(user: JwtPayLoad) {
    const payload: JwtPayLoad = {
      auth_id: user.auth_id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.AT_SECRET,
      expiresIn: process.env.AT_EXPIRES_IN,
    });

    return accessToken;
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.userService.comparePassword(
      pass,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
