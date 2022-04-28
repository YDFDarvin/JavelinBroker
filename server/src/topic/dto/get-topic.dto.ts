import { Topic } from '../models/topic.model';

export class GetTopicDto implements Omit<Topic, 'partitions' | 'params'> {
  topic: string;

  constructor(topic: string) {
    this.topic = topic;
  }
}
