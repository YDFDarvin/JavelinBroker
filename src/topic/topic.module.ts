import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicGateway } from './topic.gateway';
import { PartitionModule } from '../partition/partition.module';

@Module({
  imports: [PartitionModule],
  providers: [TopicGateway, TopicService]
})
export class TopicModule {}
