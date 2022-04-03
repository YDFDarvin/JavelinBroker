import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { GLOBAL_EVENT } from '@broker/common';
import { Socket } from 'socket.io';

import { ConsumeMessageDto } from './dto/consume-message.dto';

@WebSocketGateway()
export class ConsumerGateway {
  @SubscribeMessage(GLOBAL_EVENT.Consume)
  handleConsume(client: Socket, payload: any): WsResponse<ConsumeMessageDto> {
    return { event: GLOBAL_EVENT.Consume, data: payload };
  }
}
