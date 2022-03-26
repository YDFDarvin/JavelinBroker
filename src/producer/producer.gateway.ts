import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ProducerGateway {
  @SubscribeMessage('connect')
  handleConnection(client: Socket): string {
    console.log('client has connected: ', client.id);
    return 'pong!';
  }

  @SubscribeMessage('disconnect')
  handleDisconnection(client: Socket): string {
    console.log('client has disconnected: ', client.id);
    return 'pong!';
  }

  @SubscribeMessage('produce')
  handleProduce(client: Socket, payload: any): string {
    console.log('produce handler: ', payload);
    client.emit('consume', payload)
    return payload;
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, payload: any): string {
    console.log('produce handler: ', payload);
    return payload;
  }
}
