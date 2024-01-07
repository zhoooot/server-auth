import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MAIL_USER, REDIS_URL } from 'src/config';
import { createClient } from 'redis';
import { generate } from 'otp-generator';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private client = createClient({ url: REDIS_URL });
  private email;

  private logger = new Logger(EmailService.name);

  async onModuleInit() {
    this.client.on('error', (err) => {
      this.logger.error(err);
    });

    await this.client.connect();

    const { OAuth2 } = google.auth;

    const oauth2Client = new OAuth2(
      process.env.GOOGLE_MAILER_CLIENT_ID,
      process.env.GOOGLE_MAILER_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    this.email = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async sendEmail(email: string) {
    const oldOtp = await this.client.get(email);

    if (oldOtp) {
      throw new BadRequestException('OTP already sent');
    }

    const otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    await this.client.set(email, otp);
    await this.client.expire(email, 60 * 5);

    await this.email.sendMail({
      from: MAIL_USER,
      to: email,
      subject: 'OTP',
      text: `Your OTP is ${otp}`,
    });
  }

  async verifyOtp(email: string, otp: string) {
    const oldOtp = await this.client.get(email);

    if (oldOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
  }
}
