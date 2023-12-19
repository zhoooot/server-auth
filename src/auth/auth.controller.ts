import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JoiGuard } from './guard/joi.guard';
import { loginSchema } from './dto/login.dto';
import { SignupDto, signupSchema } from './dto/signup.dto';

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
}
