import { Injectable, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../dto/jwt-payload.dto';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.RT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayLoad) {
    const refreshToken = req['Authorization'].split(' ')[1];
    return {
      ...payload,
      refreshToken,
    };
  }
}
