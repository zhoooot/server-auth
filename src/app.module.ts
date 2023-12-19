import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class AppModule {}
