import { Module } from '@nestjs/common';
import { ProducerGateway } from './producer.gateway';
import { PartitionModule } from '../partition/partition.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [TopicModule, PartitionModule],
  providers: [ProducerGateway]
})
export class ProducerModule {}