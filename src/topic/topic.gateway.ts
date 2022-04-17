import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';
import { GLOBAL_EVENT, TOPIC_EVENTS, WsResponseBody } from '@broker/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicModel } from './models/topic.model';
import { DeleteTopicDto } from './dto/delete-topic.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { RootExceptionFilter } from '../errors/base-exception-filter';

@UseFilters(RootExceptionFilter)
@WebSocketGateway()
export class TopicGateway {
  constructor(private readonly topicService: TopicService) {}

  @SubscribeMessage(TOPIC_EVENTS.CREATE)
  async create(@MessageBody() createTopicDto: CreateTopicDto): Promise<WsResponse<WsResponseBody<CreateTopicDto, boolean>>> {
    return {
      event: GLOBAL_EVENT.CONSUME,
      data: {
        event: TOPIC_EVENTS.CREATE,
        request: createTopicDto,
        result: await this.topicService.createTopic(createTopicDto)
      }
    };
  }

  @SubscribeMessage(TOPIC_EVENTS.GET)
  async get(@MessageBody() getTopicDto: GetTopicDto): Promise<WsResponse<WsResponseBody<GetTopicDto, TopicModel>>> {
    return {
      event: GLOBAL_EVENT.CONSUME,
      data: {
        event: TOPIC_EVENTS.GET,
        request: getTopicDto,
        result: await this.topicService.getTopic(getTopicDto.topic)
      }
    };
  }

  @SubscribeMessage(TOPIC_EVENTS.GET_ALL)
  async getAll(): Promise<WsResponse<WsResponseBody<any, TopicModel[]>>> {
    return {
      event: GLOBAL_EVENT.CONSUME,
      data: {
        event: TOPIC_EVENTS.GET_ALL,
        request: null,
        result: await this.topicService.getAllTopics(),
      }
    };
  }

  @SubscribeMessage(TOPIC_EVENTS.DELETE)
  async delete(@MessageBody() deleteTopicDto: DeleteTopicDto): Promise<WsResponse<WsResponseBody<DeleteTopicDto, boolean>>> {
    return {
      event: GLOBAL_EVENT.CONSUME,
      data: {
        event: TOPIC_EVENTS.DELETE,
        request: deleteTopicDto,
        result: await this.topicService.deleteTopic(deleteTopicDto.topic)
      }
    };
  }
}
