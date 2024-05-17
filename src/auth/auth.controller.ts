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
import { EmailService } from 'src/email/email.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreatorService } from 'src/creator/creator.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authSerive: AuthService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private creatorService: CreatorService,
    private amqpConnection: AmqpConnection,
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

    // Send to the statistics

    return {
      token: await this.jwtService.sign(payload),
    };
  }

  @UseGuards(new ZodValidateGuard(loginDtoSchema))
  @Post('/register')
  async register(@Body() body: LoginDto) {
    const { email, password } = body;

    await this.authSerive.register(email, password);

    // Send to the user service
    // this.amqpConnection.publish('user', 'user.register', {
    //   email,
    // });
    // await this.creatorService.createCreator({ id: user.auth_id });
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

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.emailService.sendEmail(email);
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    await this.emailService.verifyOtp(body.email, body.otp);
  }

  @Post('/change-password-with-otp')
  async changePasswordWithOtp(
    @Body() body: { email: string; otp: string; password: string },
  ) {
    await this.emailService.verifyOtp(body.email, body.otp);
    await this.authSerive.changePassword(body.email, body.password);
  }

  @Post('/change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @Req() { user }: { user: JwtDto },
    @Body() body: { password: string },
  ) {
    await this.authSerive.changePassword(user.email, body.password);
  }
}
