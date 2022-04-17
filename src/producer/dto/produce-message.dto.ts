export interface ProduceMessagePOJO {
  topic: string;
  message: any;
}

export class ProduceMessageDto implements ProduceMessagePOJO {
  message: any;
  topic: string;

  constructor(topic: string, message: any) {
    this.topic = topic;
    this.message = message;
  }
}
