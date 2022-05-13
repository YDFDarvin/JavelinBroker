import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { GLOBAL_EVENT, WsResponseBody } from '@broker/common';
import { UseFilters, UseGuards } from '@nestjs/common';
import { RootExceptionFilter } from '../errors/base-exception-filter';
import { TopicService } from '../topic/topic.service';
import {
  ProduceMessageDto,
  ProduceMessagePOJO,
} from './dto/produce-message.dto';
import { JwtAuthGuard } from '../guards/admin.guard';

@UseFilters(RootExceptionFilter)
@UseGuards(JwtAuthGuard)
@WebSocketGateway()
export class ProducerGateway {
  constructor(private readonly topicService: TopicService) {}

  @SubscribeMessage(GLOBAL_EVENT.PRODUCE)
  async handleProduce(
    @MessageBody() produceMessageDto: ProduceMessageDto,
  ): Promise<WsResponse<WsResponseBody<ProduceMessagePOJO>>> {
    const { topic, message, isDeleteAction } = produceMessageDto;

    return {
      event: GLOBAL_EVENT.CONSUME,
      data: {
        event: GLOBAL_EVENT.PRODUCE,
        request: { topic, message },
        result: isDeleteAction
          ? await this.topicService.deleteMessage(topic, message)
          : await this.topicService.pushMessage(topic, message),
      },
    };
  }
}
