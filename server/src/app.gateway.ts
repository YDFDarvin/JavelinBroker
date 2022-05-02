import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit(server: any): any {}

  handleConnection(client: Socket, ...args): any {
    console.log('CONNECTED: ', client.id);
  }

  handleDisconnect(client: Socket): any {}
}
