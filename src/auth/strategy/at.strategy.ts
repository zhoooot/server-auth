import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const [bearer, accessToken] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    /**
     * Just in case in the future we need to get the payload
     * For now: the refresh token is enough
     */

    return {
      ...payload,
      accessToken,
    };
  }
}
