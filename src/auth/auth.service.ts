import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayLoad } from './dto/jwt-payload.dto';
import { SignupDto } from './dto/signup.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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

    // Get the TTL of the refresh token
    let ttl = this.jwtService.decode(refreshToken)['exp'];
    ttl = ttl - Math.floor(Date.now() / 1000);

    this.redisService.client.set(`AT:${refreshToken}`, user.auth_id);
    this.redisService.client.expire(`AT:${refreshToken}`, ttl);

    return {
      ...payload,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const isTokenValid = await this.redisService.client.exists(
      `AT:${refreshToken}`,
    );

    if (!isTokenValid) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    await this.redisService.client.del(`AT:${refreshToken}`);

    const isDeleted = await this.redisService.client.exists(
      `AT:${refreshToken}`,
    );

    if (isDeleted) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Logout successful',
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
