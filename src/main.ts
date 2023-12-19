import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configs from '../configs/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: configs.rmq.auth.queueUpdate,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen(4006);
}
bootstrap();
