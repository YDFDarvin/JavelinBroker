import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(Error, WsException)
export class RootExceptionFilter extends BaseWsExceptionFilter {
  private static readonly customLogger = new Logger('RootExceptionFilter');

  catch(exception: WsException, host: ArgumentsHost) {
    RootExceptionFilter.customLogger.error(exception.stack)
    super.catch(exception, host);
  }
}