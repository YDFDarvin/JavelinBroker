export class CreatePartitionDto {
  topic: string;
  params: { partitions: number; replicas: number; retention: number };
}
