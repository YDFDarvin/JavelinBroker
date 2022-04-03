import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicModel } from './models/topic.model';

@Injectable()
export class TopicService {
  create(createTopicDto: CreateTopicDto): CreateTopicDto {
    return createTopicDto;
  }

  findAll() {
    return `This action returns all topic`;
  }

  findOne(key: string) {
    return `This action returns a #${key} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
