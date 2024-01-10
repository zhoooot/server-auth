import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RABBITMQ_URL } from 'src/config';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'user',
          type: 'fanout',
        },
      ],
      uri: RABBITMQ_URL,
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessageBrokerModule {}
