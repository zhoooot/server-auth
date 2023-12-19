import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginFormGuard } from './guard/login-form.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginFormGuard, LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
