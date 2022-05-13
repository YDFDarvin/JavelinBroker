export interface PartitionPOJO {
  key: string;
  data: string[];
  retention: number;
}

export class PartitionModel {
  private readonly key: string;
  private readonly retention?: number;
  private data: string[];

  constructor(key: string, data?: string[], retention?: number) {
    this.key = key;
    this.retention = retention;
    this.data = data || [];
  }

  getKey() {
    return this.key;
  }

  getData() {
    return this.data;
  }

  getRetention() {
    return this.retention;
  }

  pushMessage(message: string) {
    this.data.push(message);
  }

  deleteMessage(index: number) {
    this.data = this.data?.filter((_, idx) => idx !== index);
  }

  static generateKey(key: string, index?: number) {
    if (!index) return `${key}_0`;

    return `${key}_${index}`;
  }
}
