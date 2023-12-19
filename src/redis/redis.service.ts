import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisClientType, RedisClusterType, createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType | RedisClusterType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}
