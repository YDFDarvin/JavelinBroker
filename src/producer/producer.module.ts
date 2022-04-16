import { Module } from '@nestjs/common';
import { PartitionService } from '../partition/partition.service';
import { ProducerGateway } from './producer.gateway';
import { PartitionModule } from '../partition/partition.module';

@Module({
  imports: [PartitionModule],
  providers: [ProducerGateway]
})
export class ProducerModule {}