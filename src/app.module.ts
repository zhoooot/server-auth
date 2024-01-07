import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailModule } from './email/email.module';
import { MessageBrokerModule } from './message-broker/message-broker.module';
import config from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...config,
    }),
    AuthModule,
    JwtModule,
    EmailModule,
    MessageBrokerModule,
  ],
})
export class AppModule {}
