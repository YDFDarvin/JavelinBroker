import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GLOBAL_EVENT } from "../@types";

@WebSocketGateway()
export class ProducerGateway {
  @SubscribeMessage(GLOBAL_EVENT.Produce)
  handleProduce(client: Socket, payload: any): string {
    console.log('produce handler: ', payload);

    client.emit(GLOBAL_EVENT.Consume, payload);

    return payload;
  }
}
