import { GLOBAL_EVENT, TOPIC_EVENTS } from '@broker/common';

export interface WsResponseBody<T = any, K = any> {
  event: GLOBAL_EVENT | TOPIC_EVENTS;
  request: T;
  result: K;
}