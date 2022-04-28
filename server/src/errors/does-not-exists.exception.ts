import { WsException } from '@nestjs/websockets';

export class DoesNotExistsException extends WsException {
  constructor() {
    super('Does not exists!');
  }
}
