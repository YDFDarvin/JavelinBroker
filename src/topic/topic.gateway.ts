import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { TOPIC_EVENTS } from '@broker/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ProduceMessageDto } from '../producer/dto/produce-message.dto';
import { TopicModel } from './models/topic.model';

@WebSocketGateway()
export class TopicGateway {
  constructor(private readonly topicService: TopicService) {}

  @SubscribeMessage(TOPIC_EVENTS.CREATE)
  create(@MessageBody() createTopicDto: CreateTopicDto): WsResponse<CreateTopicDto> {
    return { event: TOPIC_EVENTS.GET, data: this.topicService.create(createTopicDto)};
  }

  @SubscribeMessage(TOPIC_EVENTS.GET_ALL)
  findAll() {
    console.log(TOPIC_EVENTS.GET_ALL);
    return this.topicService.findAll();
  }

  @SubscribeMessage(TOPIC_EVENTS.GET)
  findOne(@MessageBody() key: string) {
    console.log(TOPIC_EVENTS.GET);
    return this.topicService.findOne(key);
  }

  @SubscribeMessage(TOPIC_EVENTS.UPDATE)
  update(@MessageBody() updateTopicDto: UpdateTopicDto) {
    console.log(TOPIC_EVENTS.UPDATE);
    return this.topicService.update(updateTopicDto.id, updateTopicDto);
  }

  @SubscribeMessage(TOPIC_EVENTS.DELETE)
  delete(@MessageBody() id: number) {
    console.log(TOPIC_EVENTS.DELETE);
    return this.topicService.remove(id);
  }
}
