import { CacheModule, Module } from '@nestjs/common';
import { PartitionService } from './partition.service';
import { PartitionRepository } from './partition.repository';

@Module({
  imports: [CacheModule.register({
    isGlobal: true
  })],
  providers: [PartitionRepository, PartitionService]
})
export class PartitionModule {}
