import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../dto/jwt-payload.dto';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayLoad) {
    const refreshToken = req.get('Authorization').replace('Bearer ', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
