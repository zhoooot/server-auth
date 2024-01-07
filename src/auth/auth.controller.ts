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
import {
  RABBITMQ_USER_EXCHANGE_NAME,
  RABBITMQ_USER_ROUTING_KEYS,
} from 'src/config';
import { User, UserRole } from 'src/entities/user.entity';
import { v4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(
    private authSerive: AuthService,
    private jwtService: JwtService,
    private emailService: EmailService,
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

  @Post('/dummy-user')
  async sendDummyUser() {
    const user: User = {
      auth_id: v4(),
      email: 'sample@email.com',
      role: UserRole.USER,
      created_at: new Date(),
      password: '123456',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    this.amqpConnection.publish(
      RABBITMQ_USER_EXCHANGE_NAME,
      RABBITMQ_USER_ROUTING_KEYS.created,
      rest,
    );

    return {
      message: 'User created',
    };
  }
}
