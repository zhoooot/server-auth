import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginDtoSchema } from './dtos/login.dto';
import { ZodValidateGuard } from 'src/common/guard/zod-validate.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtDto } from 'src/common/dtos/payload.dto';
import { JwtGuard } from 'src/jwt/guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authSerive: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(new ZodValidateGuard(loginDtoSchema))
  @Post('/login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    const user = await this.authSerive.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: JwtDto = {
      sub: user.auth_id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    return {
      token: await this.jwtService.sign(payload),
    };
  }

  @UseGuards(new ZodValidateGuard(loginDtoSchema))
  @Post('/register')
  async register(@Body() body: LoginDto) {
    const { email, password } = body;

    await this.authSerive.register(email, password);
  }

  @UseGuards(JwtGuard)
  @Post('/authenticate')
  async authenticate(@Req() { user }: { user: JwtDto }) {
    if (this.authSerive.validateJwtPayload(user) === null) {
      throw new BadRequestException('Invalid credentials');
    }

    const updateUser = {
      ...user,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    return {
      token: await this.jwtService.sign(updateUser),
    };
  }
}
