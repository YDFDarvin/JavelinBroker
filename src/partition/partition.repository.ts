import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PartitionModel, PartitionPOJO } from './models/partition.model';
import { CryptoBase64 } from '../utils/crypto';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';

@Injectable()
export class PartitionRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Default retention will be set as 5min
  private static defaultRetention = 5 * 60 * 1000;

  async deletePartition(topicName: string, index: number): Promise<boolean> {
    const key = PartitionModel.generateKey(topicName, index);

    if (!await this.cacheManager.get(key)) throw new DoesNotExistsException();

    return !!await this.cacheManager.del(key);
  }

  async createPartition(topicName: string, index: number, retention?: number): Promise<boolean> {
    const key = PartitionModel.generateKey(topicName, index);
    const model = new PartitionModel(key, [], retention ? retention * 1000 : PartitionRepository.defaultRetention);

    if (await this.cacheManager.get(key)) throw new AlreadyExistsException();

    const hasCreated = retention
      ? await this.cacheManager.set(key, CryptoBase64.to(model), { ttl: retention * 1000 })
      : await this.cacheManager.set(key, CryptoBase64.to(model), { ttl: PartitionRepository.defaultRetention });

    return !!hasCreated;
  }

  async getPartitionByKey(topicName: string, index: number): Promise<PartitionModel | null> {
    const key = PartitionModel.generateKey(topicName, index);
    const encryptedMessages: string = await this.cacheManager.get(key);

    if (!encryptedMessages) return null;

    const messages: string[] = CryptoBase64.from<PartitionPOJO>(encryptedMessages)!.data;
    const retention: number = CryptoBase64.from<PartitionPOJO>(encryptedMessages)!.retention;

    return new PartitionModel(key, messages, retention);
  }

  // TODO: Handle out of Boundaries
  async pushMessage(topicName: string, index: number, message: string) {
    const partitionModel = await this.getPartitionByKey(topicName, index);

    if (!partitionModel) throw new DoesNotExistsException();

    partitionModel.pushMessage(message);

    await this.deletePartition(topicName, index);

    return !!await this.cacheManager.set(
      partitionModel.getKey(),
      CryptoBase64.to(partitionModel),
      {
        ttl: partitionModel.getRetention(),
      }
    );
  }
}