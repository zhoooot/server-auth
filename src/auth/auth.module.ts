import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { EmailModule } from 'src/email/email.module';
import { MessageBrokerModule } from 'src/message-broker/message-broker.module';

@Module({
  imports: [EmailModule, MessageBrokerModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
