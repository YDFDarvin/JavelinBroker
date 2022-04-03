import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GLOBAL_EVENT } from '@broker/common';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { ConsumeMessageDto } from '../consumer/dto/consume-message.dto';

@WebSocketGateway()
export class ProducerGateway {
  @SubscribeMessage(GLOBAL_EVENT.PRODUCE)
  handleProduce(
    @ConnectedSocket() client: Socket, @MessageBody() payload: ProduceMessageDto,
  ): WsResponse<ProduceMessageDto> {
    // TODO: add ProducerService with injected TopicService & PartitionService
    return { event: GLOBAL_EVENT.CONSUME, data: payload };
  }
}
