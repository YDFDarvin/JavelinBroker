import { Injectable } from '@nestjs/common';
import { PartitionRepository } from './partition.repository';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { PartitionModel } from './models/partition.model';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';

@Injectable()
export class PartitionService {
  constructor(private readonly partitionRepository: PartitionRepository) {}

  async getPartition(topic: string, index: number): Promise<PartitionModel> {
    const partition = await this.partitionRepository.getPartitionByKey(
      topic,
      index,
    );

    if (!partition) throw new DoesNotExistsException();

    return partition;
  }

  async deletePartition(topic: string, index: number): Promise<boolean> {
    const hasPartition = await this.partitionRepository.getPartitionByKey(
      topic,
      index,
    );

    if (!hasPartition) throw new DoesNotExistsException();

    return !!(await this.partitionRepository.deletePartition(topic, index));
  }

  async createPartition(
    topic: string,
    index: number,
    retention?: number,
  ): Promise<boolean> {
    const hasPartition = await this.partitionRepository.getPartitionByKey(
      topic,
      index,
    );

    if (!!hasPartition) throw new AlreadyExistsException();

    return !!(await this.partitionRepository.createPartition(
      topic,
      index,
      retention,
    ));
  }

  // TODO: Define Array Boundaries and throw an separate Exception
  async pushMessage(topic: string, index: number, message: string) {
    const partition: PartitionModel =
      await this.partitionRepository.getPartitionByKey(topic, index);

    if (!partition) throw new DoesNotExistsException();

    return !!(await this.partitionRepository.pushMessage(
      topic,
      index,
      message,
    ));
  }

  async deleteMessage(topic: string, index: number, indexOfMessage: number) {
    const partition: PartitionModel =
      await this.partitionRepository.getPartitionByKey(topic, index);

    if (!partition) throw new DoesNotExistsException();

    return !!(await this.partitionRepository.deleteMessage(
      topic,
      index,
      indexOfMessage,
    ));
  }
}
