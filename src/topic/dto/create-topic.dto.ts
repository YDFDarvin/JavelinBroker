import { Topic, TopicModelParams } from '../models/topic.model';

export class CreateTopicDto implements Omit<Topic, 'partitions'> {
  params: TopicModelParams;
  topic: string;

  constructor(topic: string, params: TopicModelParams) {
    this.topic = topic;
    this.params = params;
  }
}
