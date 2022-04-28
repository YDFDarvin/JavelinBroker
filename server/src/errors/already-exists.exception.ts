import { WsException } from '@nestjs/websockets';

export class AlreadyExistsException extends WsException {
  constructor() {
    super('Already exists!');
  }
}
