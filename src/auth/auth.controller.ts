import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JoiGuard } from './guard/joi.guard';
import { loginSchema } from './dto/login.dto';
import { SignupDto, signupSchema } from './dto/signup.dto';
import { RtAuthGuard } from './guard/rt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(new JoiGuard(loginSchema), LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(new JoiGuard(signupSchema))
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @UseGuards(RtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const { refreshToken } = req.user;

    return await this.authService.logout(refreshToken);
  }

  @UseGuards(RtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req: any) {
    const { refreshToken } = req.body;

    return await this.authService.refresh(refreshToken);
  }
}
