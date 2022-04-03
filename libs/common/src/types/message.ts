export interface IBrokerHeader {
  // Stored at partitions
  partitions: any[] | any;
  // Has a backup
  hasReplicas: boolean;
  // List of connected replication brokers
  brokers: any[];
  // Version of message
  version: any;
}
export interface IBrokerConfig {}

export interface IMetadata {
  header: IBrokerHeader;
  config: IBrokerConfig;
};

export type IPayload<T = any> = Record<any, any> & {
  topic: string;
  data: T | any;
};
