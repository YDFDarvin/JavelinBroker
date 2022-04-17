export interface TopicModelParams {
  partitions: number;
  replicas: number;
  retention?: number;
}

export interface Topic {
  topic: string;
  partitions: string[];
  params: TopicModelParams;
}

export class TopicModel implements Readonly<Topic> {
  constructor(topic: string, partitions: string[], params: TopicModelParams) {
    this.topic = topic;
    this.partitions = partitions;
    this.params = params;
  }

  getTopic() {
    return this.topic;
  }

  getPartitions() {
    return this.partitions;
  }

  getParams() {
    return this.params;
  }

  updatePartition(partitions: string[]) {
    this.partitions = partitions;
  }

  linkPartition(partition: string) {
    this.partitions.push(partition);
  }

  params: TopicModelParams;
  partitions: string[];
  topic: string;
}
