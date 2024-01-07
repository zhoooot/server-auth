import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RABBITMQ_URL, RABBITMQ_USER_EXCHANGE_NAME } from 'src/config';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: RABBITMQ_USER_EXCHANGE_NAME,
          type: 'fanout',
        },
      ],
      uri: RABBITMQ_URL,
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessageBrokerModule {}
