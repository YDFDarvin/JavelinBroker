import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { GLOBAL_EVENT } from '@broker/common';
import { PartitionService } from '../partition/partition.service';

@WebSocketGateway()
export class ProducerGateway {
/*  @SubscribeMessage(GLOBAL_EVENT.PRODUCE)
  handleProduce(@MessageBody() payload: { topic: string, message: any }): WsResponse<any> {
    // TODO: add ProducerService with injected TopicService & PartitionService
    return { event: GLOBAL_EVENT.CONSUME, data: PartitionService.pushMessage(payload.topic, payload.message) };
  }*/
}
