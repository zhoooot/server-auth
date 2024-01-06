import { Injectable } from '@nestjs/common';
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from 'src/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private expiresIn: number = 60 * 60 * 24 * 7; // 7 days

  async sign(payload: any) {
    console.log(payload);

    return jwt.sign(payload, JWT_PRIVATE_KEY, {
      algorithm: 'RS256',
    });
  }

  async verify(token: string) {
    // Keep the verify simple
    // let the guard handle the timing

    return jwt.verify(token, JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
  }
}
