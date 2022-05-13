import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicRepository } from './topic.repository';
import { PartitionService } from '../partition/partition.service';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import {
  PartitionModel,
  PartitionPOJO,
} from '../partition/models/partition.model';
import { TopicModel } from './models/topic.model';
import { CryptoBase64 } from '../utils/crypto';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';

@Injectable()
export class TopicService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly topicRepository: TopicRepository,
    private readonly partitionService: PartitionService,
  ) {}

  private async getTopicPartitionKeys(topic: string): Promise<string[]> {
    const currentTopicModel: TopicModel = await this.getTopic(topic);
    const encodedPartitions: string[] = currentTopicModel.getPartitions();

    return encodedPartitions.map(
      (encodedPartition) =>
        CryptoBase64.from<PartitionPOJO>(encodedPartition)!.key,
    );
  }

  private static formatTopicToPointer(topic: string): string {
    return `rr_pointer_${topic}`;
  }

  async createTopic(createTopicDto: CreateTopicDto): Promise<boolean> {
    const { topic, params } = createTopicDto;
    const { partitions, retention, replicas } = params;

    const hasTopic = await this.topicRepository.getTopic(topic);

    if (hasTopic) throw new AlreadyExistsException();

    const storedPartitions: PartitionModel[] = [];

    for (let i = 0; i < partitions; i++) {
      await this.partitionService.createPartition(topic, i, retention);

      const partitionModel: PartitionModel =
        await this.partitionService.getPartition(topic, i);
      storedPartitions.push(partitionModel);
    }

    const topicModel = new TopicModel(
      topic,
      storedPartitions.map((partition) => CryptoBase64.to(partition)),
      params,
    );

    return !!(await this.topicRepository.createTopic(topicModel));
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

        const freshPartition = await this.partitionService.getPartition(
          topic.getTopic(),
          Number.parseInt(index),
        );

        partitionsWipe.push(freshPartition);
      }

      topic.updatePartition(
        partitionsWipe.map((partition) => {
          const partitionPOJO: PartitionPOJO = {
            key: partition.getKey(),
            retention: partition.getRetention(),
            data: partition.getData(),
          };
          return CryptoBase64.to(partitionPOJO);
        }),
      );
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
        const { key, data } = CryptoBase64.from<PartitionPOJO>(partition);
        return new PartitionModel(key, data);
      });

    for (const partition of partitions) {
      const [topicName, index] = partition.getKey().split('_');
      await this.partitionService.deletePartition(topicName, Number(index));
    }

    return !!(await this.topicRepository.deleteTopic(topicModel));
  }

  async pushMessage(topic: string, message: any) {
    const encryptedMessage = CryptoBase64.to({
      id: randomBytes(20).toString('hex'),
      ctx: message,
      createdAt: Date.now(),
    });

    const topicPointer = TopicService.formatTopicToPointer(topic);

    const pointerToStore = await this.cacheManager.get<string>(topicPointer);
    const partitionKeys = await this.getTopicPartitionKeys(topic);

    if (!pointerToStore) {
      await this.partitionService.pushMessage(topic, 0, encryptedMessage);
      await this.cacheManager.set(topicPointer, partitionKeys[0], {
        ttl: Number.MAX_SAFE_INTEGER,
      });
    } else {
      const [_, index] = pointerToStore?.split('_');
      const numericIndex = Number.parseInt(index);

      if (numericIndex < partitionKeys.length - 1) {
        await this.partitionService.pushMessage(
          topic,
          numericIndex + 1,
          encryptedMessage,
        );
        await this.cacheManager.set(
          topicPointer,
          partitionKeys[numericIndex + 1],
          { ttl: Number.MAX_SAFE_INTEGER },
        );
      } else {
        await this.partitionService.pushMessage(topic, 0, encryptedMessage);
        await this.cacheManager.set(topicPointer, partitionKeys[0], {
          ttl: Number.MAX_SAFE_INTEGER,
        });
      }
    }
  }

  async deleteMessage(topic: string, message: any & { id: string }) {
    const messageId = message.id;

    // Get list of partitions
    const partitionKeys = await this.getTopicPartitionKeys(topic);
    const partitions: PartitionModel[] = await Promise.all(
      partitionKeys.map(
        async (_, index) =>
          await this.partitionService.getPartition(topic, index),
      ),
    );

    // Find an owner of the message
    const messageOwner: PartitionModel = partitions?.find((partition) =>
      partition
        .getData()
        ?.some(
          (encryptedMessage) =>
            CryptoBase64.from<any & { id: string }>(encryptedMessage)?.id ===
            messageId,
        ),
    );

    // Find the index inside of owners data list
    const messageIndex: number = messageOwner
      ?.getData()
      ?.findIndex(
        (encryptedMessage) =>
          CryptoBase64.from<any & { id: string }>(encryptedMessage)?.id ===
          messageId,
      );

    // Get index of partition
    const [_, index] = messageOwner.getKey().split('_');

    await this.partitionService.deleteMessage(
      topic,
      Number.parseInt(index),
      messageIndex,
    );
  }
}
