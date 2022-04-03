interface TopicModelParams {
  partitions: number;
  replicas: number;
}

export class TopicModel {
  topic: string;
  params: TopicModelParams;
}
