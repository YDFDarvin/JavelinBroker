import { Injectable } from '@nestjs/common';
import { PartitionRepository } from './partition.repository';
import { CreatePartitionDto } from './dto/create-partition.dto';
import { AlreadyExistsException } from '../errors/already-exists.exception';
import { PartitionModel } from './models/partition.model';

@Injectable()
export class PartitionService {
  // <T, V> - T is a type of key, V is an array type of hash of messages
  constructor(private readonly partitionRepository: PartitionRepository) {}
/*  private static partitions: Map<string, string[]> = new Map();
  private static partitionSize: number = Number(process.env.PARTITION_SIZE_LIMIT);

  static create(topic: string, number: number) {
    if (this.partitions.has(`${topic}_${0}`)) throw Error(`Partition ${topic}_${number} does not exists`);
    if (number === 0) this.partitions.set(`${topic}_${0}`, []);

    for (let i=0; i<number; i++) {
      if (!this.partitions.has(`${topic}_${i}`)) this.partitions.set(`${topic}_${i}`, []);
    }
  }

  static getPartitions() {
    return Array.from(this.partitions.keys());
  }

  static getTopicsPartitions(topic: string, number: number) {
    const partitions = [];

    for (let i=0; i<number; i++) {
      if (!this.partitions.has(`${topic}_${i}`)) throw Error(`Partition ${topic}_${i} does not exists`);

      partitions.push(`${topic}_${i}`);
    }

    return partitions;
  }

  static pushMessage(topic: string, message: any) {
    return PartitionService.pushMessageInPartition(topic, 0, btoa(message));
  }

  static pushMessageInPartition(topic: string, id: number, hash: string) {
    if (!this.partitions.has(`${topic}_${id}`)) throw Error('Partition does not exists');

    const messages = this.partitions.get(`${topic}_${id}`);

    // TODO: calculate out of range number f topics
    if (messages.length >= this.partitionSize) {
      if (this.partitions.has(`${topic}_${id + 1}`)) return this.pushMessageInPartition(topic, id + 1, hash);
      else throw Error('Partition size limit has excited!');
    }

    return this.partitions.set(`${topic}_${id}`, [...messages, hash]);
  }

  static delete(key: string) {
    return this.partitions.delete(key);
  }*/

  getAll() {

  }

  async deletePartitionsByTopic(topic: string): Promise<boolean> {
    return await this.partitionRepository.deleteAllPartitionsByTopic(topic);
  }

  async getByTopic(topic: string): Promise<PartitionModel[]> {
    return await this.partitionRepository.getAllPartitionsByTopic(topic);
  }

  async createPartition(request: CreatePartitionDto): Promise<boolean> {
    const { topic, params } = request;
    const { partitions, retention, replicas } = params;

    const hasHeadPartition = await this.partitionRepository.getPartitionByKey(topic, 0);

    if (!!hasHeadPartition) throw new AlreadyExistsException();
    if (!partitions) await this.partitionRepository.createPartition(topic, 0, retention);

    for (let i=0; i<partitions; i++) await this.partitionRepository.createPartition(topic, i, retention);

    return true;
  }
}
