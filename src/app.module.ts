import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerGateway } from './consumer/consumer.gateway';
import { TopicModule } from './topic/topic.module';
import { AppGateway } from './app.gateway';
import { ProducerModule } from './producer/producer.module';
import { PartitionModule } from './partition/partition.module';

@Module({
  imports: [TopicModule, ProducerModule, PartitionModule, ConfigModule.forRoot({
    envFilePath: '.env.development',
  })],
  providers: [ConsumerGateway, AppGateway],
})
export class AppModule {}
