export interface PartitionPOJO {
  key: string;
  data: string[];
}

export class PartitionModel {
  private readonly key: string;
  private readonly data: string[];

  constructor(key: string, data?: string[]) {
    this.key = key;
    this.data = data || [];
  }

  getKey() {
    return this.key;
  }

  pushMessage(message: string) {
    this.data.push(message);
  }

  getData() {
    return this.data;
  }

  static generateKey(key: string, index?: number) {
    if (!index) return `${key}_0`;

    return `${key}_${index}`;
  }
}
