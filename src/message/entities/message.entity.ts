import { IMetadata, IPayload } from '@broker/common';

export class BaseMessage {
  meta: IMetadata;
  payload: IPayload;
}
