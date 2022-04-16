import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { PartitionService } from '../partition/partition.service';

@Injectable()
export class TopicService {
  // <T, V> - T is a type of key, V is an array type of partition keys
  private topics: Map<string, string[]>;

/*  constructor() {
    this.topics = new Map();
  }

  create(createTopicDto: CreateTopicDto) {
    const { topic, params } = createTopicDto;

    if (this.topics.has(topic)) throw Error('Topic already exists');

    //PartitionService.create(topic, params.partitions);

    //return Array.from(this.topics.set(topic, PartitionService.getTopicsPartitions(topic, params.partitions)).entries());
  }

  getAll() {
    return Array.from(this.topics.keys());
  }

  findByKey(key: string) {
    return { topic: key, partitions: this.topics.get(key) };
  }

  remove(key: string) {
    for (const partition of this.topics.get(key)) {
      //if (!PartitionService.delete(partition)) return false;
    }

    return this.topics.delete(key);
  }*/
}
