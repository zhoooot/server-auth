import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../dto/jwt-payload.dto';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AT_SECRET,
    });
  }

  validate(payload: JwtPayLoad): JwtPayLoad {
    return payload;
  }
}
