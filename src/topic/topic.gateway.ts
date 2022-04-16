import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { GLOBAL_EVENT, TOPIC_EVENTS } from '@broker/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@WebSocketGateway()
export class TopicGateway {
  constructor(private readonly topicService: TopicService) {}

/*  @SubscribeMessage(TOPIC_EVENTS.CREATE)
  create(@MessageBody() createTopicDto: CreateTopicDto): WsResponse {
    return { event: GLOBAL_EVENT.CONSUME, data: this.topicService.create(createTopicDto)};
  }

  @SubscribeMessage(TOPIC_EVENTS.GET_ALL)
  findAll(): WsResponse {
    return { event: GLOBAL_EVENT.CONSUME, data: this.topicService.getAll()};
  }

  @SubscribeMessage(TOPIC_EVENTS.GET)
  findOne(@MessageBody() key: string): WsResponse {
    return { event: GLOBAL_EVENT.CONSUME, data: this.topicService.findByKey(key)};
  }

  @SubscribeMessage(TOPIC_EVENTS.DELETE)
  delete(@MessageBody() topic: string): WsResponse {
    return { event: GLOBAL_EVENT.CONSUME, data: this.topicService.remove(topic)};
  }*/
}
