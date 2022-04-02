import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicGateway } from './topic.gateway';

@Module({
  providers: [TopicGateway, TopicService]
})
export class TopicModule {}
