import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
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

  /**
   * Return the refresh token and the authId
   * for the logout
   */

  validate(req: Request, payload: JwtPayLoad) {
    const [bearer, refreshToken] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return {
      authId: payload.auth_id,
      refreshToken,
    };
  }
}
