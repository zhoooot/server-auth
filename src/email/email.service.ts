import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  ADMIN_EMAIL_ADDRESS,
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_MAILER_REFRESH_TOKEN,
  REDIS_URL,
} from 'src/config';
import { createClient } from 'redis';
import { generate } from 'otp-generator';
import { google } from 'googleapis';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private client = createClient({ url: REDIS_URL });
  private email: Transporter;

  private logger = new Logger(EmailService.name);

  async onModuleInit() {
    this.client.on('error', (err) => {
      this.logger.error(err);
    });

    await this.client.connect();

    const { OAuth2 } = google.auth;

    const oauth2Client = new OAuth2(
      GOOGLE_MAILER_CLIENT_ID,
      GOOGLE_MAILER_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    this.email = createTransport({
      host: 'gmail',
      auth: {
        type: 'OAuth2',
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
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
      from: ADMIN_EMAIL_ADDRESS,
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
