import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicRepository } from './topic.repository';
import { PartitionService } from '../partition/partition.service';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { PartitionModel, PartitionPOJO } from '../partition/models/partition.model';
import { TopicModel } from './models/topic.model';
import { CryptoBase64 } from '../utils/crypto';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly partitionService: PartitionService
  ) {}

  async createTopic(createTopicDto: CreateTopicDto): Promise<boolean> {
    const { topic, params } = createTopicDto;
    const { partitions, retention, replicas } = params;

    const hasTopic = await this.topicRepository.getTopic(topic);

    if (hasTopic) throw new AlreadyExistsException();

    const storedPartitions: PartitionModel[] = [];

    for (let i=0; i< partitions; i++) {
      await this.partitionService.createPartition(topic, i, retention);

      const partitionModel: PartitionModel = await this.partitionService.getPartition(topic, i);
      storedPartitions.push(partitionModel);
    }

    const topicModel = new TopicModel(
      topic,
      storedPartitions.map((partition) => (CryptoBase64.to(partition))),
      params
    );

    return !!await this.topicRepository.createTopic(topicModel);
  }

  async getTopic(topic: string): Promise<TopicModel> {
    const topicModel: TopicModel = await this.topicRepository.getTopic(topic);

    if (!topicModel) throw new DoesNotExistsException();

    return topicModel;
  }

  async deleteTopic(topic: string): Promise<boolean>  {
    const topicModel: TopicModel = await this.topicRepository.getTopic(topic);

    if (!topicModel) throw new DoesNotExistsException();

    const partitions: PartitionModel[] = topicModel
      .getPartitions()
      .map((partition) => {
        const { key, data } = (CryptoBase64.from<PartitionPOJO>(partition));
        return new PartitionModel(key, data);
      })

    for (const partition of partitions) {
      const [topicName, index] = partition.getKey().split('_');
      await this.partitionService.deletePartition(topicName, Number(index));
    }

    return !!await this.topicRepository.deleteTopic(topicModel);
  }
}
