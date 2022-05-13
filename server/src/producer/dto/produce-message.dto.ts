export interface ProduceMessagePOJO {
  topic: string;
  message: any;
}

export class ProduceMessageDto implements ProduceMessagePOJO {
  message: any;
  topic: string;
  isDeleteAction?: boolean = false;

  constructor(topic: string, message: any, isDeleteAction?: boolean) {
    this.topic = topic;
    this.message = message;
    this.isDeleteAction = isDeleteAction ? isDeleteAction : false;
  }
}
