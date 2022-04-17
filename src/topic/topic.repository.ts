import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TopicModel, TopicModelParams } from './models/topic.model';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { CryptoBase64 } from '../utils/crypto';
import { DoesNotExistsException } from '../errors/does-not-exists.exception';

@Injectable()
export class TopicRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async createTopic(topic: TopicModel): Promise<boolean>  {
    const key = topic.getTopic();
    const { retention } = topic.getParams();

    if (await this.cacheManager.get(key)) throw new AlreadyExistsException();

    const hasCreated = retention
      ? await this.cacheManager.set(key, CryptoBase64.to(topic), { ttl: retention * 1000 })
      // Default retention will be set as 5min
      : await this.cacheManager.set(key, CryptoBase64.to(topic), { ttl: 5 * 60 * 1000 });

    return !!hasCreated;
  }

  async deleteTopic(topic: TopicModel): Promise<boolean> {
    const key = topic.getTopic();

    if (!await this.cacheManager.get(key)) throw new DoesNotExistsException();

    return !!await this.cacheManager.del(key);
  }

  async getTopic(topicName: string): Promise<TopicModel | null> {
    const encryptedTopic: string = await this.cacheManager.get(topicName);

    if (!encryptedTopic) return null;

    const { partitions, params } = CryptoBase64.from<{ topic: string, partitions: string[], params: TopicModelParams }>(encryptedTopic);

    return new TopicModel(topicName, partitions, params);
  }

  async getTopicKeys(): Promise<string[]>  {
    return (await this.cacheManager.store.keys())?.filter((key) => !key.includes('_'));
  }
}