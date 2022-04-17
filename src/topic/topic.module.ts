import { CacheModule, Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicGateway } from './topic.gateway';
import { TopicRepository } from './topic.repository';
import { PartitionModule } from '../partition/partition.module';

@Module({
  imports: [PartitionModule, CacheModule.register({
    isGlobal: true
  })],
  exports: [TopicRepository, TopicService],
  providers: [TopicGateway, TopicService, TopicRepository]
})
export class TopicModule {}
