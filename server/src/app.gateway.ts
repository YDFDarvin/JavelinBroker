import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  afterInit(server: any): any {
  }

  handleConnection(client: any, ...args): any {
  }

  handleDisconnect(client: any): any {
  }
}
