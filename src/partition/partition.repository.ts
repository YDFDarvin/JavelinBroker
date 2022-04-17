import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PartitionModel, PartitionPOJO } from './models/partition.model';
import { CryptoBase64 } from '../utils/crypto';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';

@Injectable()
export class PartitionRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async deletePartition(topicName: string, index: number): Promise<boolean> {
    const key = PartitionModel.generateKey(topicName, index);

    if (!await this.cacheManager.get(key)) throw new DoesNotExistsException();

    return !!await this.cacheManager.del(key);
  }

  async createPartition(topicName: string, index: number, retention?: number): Promise<boolean> {
    const key = PartitionModel.generateKey(topicName, index);
    const model = new PartitionModel(key);

    if (await this.cacheManager.get(key)) throw new AlreadyExistsException();

    const hasCreated = retention
      ? await this.cacheManager.set(key, CryptoBase64.to(model), { ttl: retention * 1000 })
      // Default retention will be set as 5min
      : await this.cacheManager.set(key, CryptoBase64.to(model), { ttl: 5 * 60 * 1000 });

    return !!hasCreated;
  }

  async getPartitionByKey(topicName: string, index: number): Promise<PartitionModel | null> {
    const key = PartitionModel.generateKey(topicName, index);
    const encryptedMessages: string = await this.cacheManager.get(key);

    if (!encryptedMessages) return null;

    const messages: string[] = CryptoBase64.from<PartitionPOJO>(encryptedMessages)!.data;

    return new PartitionModel(key, messages);
  }
  // TODO: pushMessageToTopicMethod
}