import { Module } from '@nestjs/common';
import { ProducerGateway } from './producer/producer.gateway';
import { ConsumerGateway } from './consumer/consumer.gateway';
import { TopicModule } from './topic/topic.module';
import { MessageModule } from './message/message.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [TopicModule, MessageModule],
  controllers: [],
  providers: [ProducerGateway, ConsumerGateway, AppGateway],
})
export class AppModule {}
