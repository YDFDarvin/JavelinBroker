import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {Socket} from "socket.io";
import {GLOBAL_EVENT} from "../@types";

@WebSocketGateway()
export class ConsumerGateway {
  @SubscribeMessage(GLOBAL_EVENT.Consume)
  handleConsume(client: Socket, payload: any): string {
    console.log('consume handler: ', payload);

    client.emit(GLOBAL_EVENT.Consume, payload);

    return payload;
  }
}
