import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GLOBAL_EVENT } from '@broker/common';
import { ProduceMessageDto } from './dto/produce-message.dto';

@WebSocketGateway()
export class ProducerGateway {
  @SubscribeMessage(GLOBAL_EVENT.Produce)
  handleProduce(
    client: Socket,
    payload: ProduceMessageDto,
  ): WsResponse<ProduceMessageDto> {
    return { event: GLOBAL_EVENT.Consume, data: payload };
  }
}
