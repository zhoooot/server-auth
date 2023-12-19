import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { AtStrategy } from './strategy/at.strategy';

@Module({
  imports: [UserModule, PassportModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy, AtStrategy],
})
export class AuthModule {}
