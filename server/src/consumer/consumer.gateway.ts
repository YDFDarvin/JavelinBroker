import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { GLOBAL_EVENT } from '@broker/common';
import { Socket } from 'socket.io';
import { ConsumeMessageDto } from './dto/consume-message.dto';

@WebSocketGateway()
export class ConsumerGateway {
  @SubscribeMessage(GLOBAL_EVENT.CONSUME)
  handleConsume(@ConnectedSocket() client: Socket, @MessageBody() payload: ConsumeMessageDto): WsResponse<ConsumeMessageDto> {
    return { event: GLOBAL_EVENT.CONSUME, data: payload };
  }
}
