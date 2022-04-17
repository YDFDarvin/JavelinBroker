import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicRepository } from './topic.repository';
import { PartitionService } from '../partition/partition.service';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { PartitionModel, PartitionPOJO } from '../partition/models/partition.model';
import { TopicModel } from './models/topic.model';
import { CryptoBase64 } from '../utils/crypto';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';
import { Cache } from 'cache-manager';

@Injectable()
export class TopicService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getAllTopics(): Promise<TopicModel[]> {
    const keys: string[] = await this.topicRepository.getTopicKeys();

    const topicModels: TopicModel[] = [];

    for (const key of keys) {
      const topic = await this.topicRepository.getTopic(key);

      const partitionsWipe: PartitionModel[] = [];
      for (const partition of topic.partitions) {
        const { key } = CryptoBase64.from<PartitionPOJO>(partition);
        const [_, index] = key.split('_');

        const freshPartition = await this.partitionService.getPartition(topic.getTopic(), Number.parseInt(index))

        partitionsWipe.push(freshPartition);
      }

      topic.updatePartition(
        partitionsWipe.map((partition) => {
          const partitionPOJO: PartitionPOJO = {
            key: partition.getKey(),
            retention: partition.getRetention(),
            data: partition.getData(),
          }
          return CryptoBase64.to(partitionPOJO);
        })
      )
      topicModels.push(topic);
    }

    return topicModels;
  }

  async deleteTopic(topic: string): Promise<boolean> {
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

  async pushMessage(topic: string, message: any) {
    const encryptedMessage = CryptoBase64.to(message);

    // TODO: Round-Robin pushing
    await this.partitionService.pushMessage(topic, 0, encryptedMessage);
  }

}
