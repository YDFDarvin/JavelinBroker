import { TopicModel } from '../models/topic.model';
import { OmitType } from '@nestjs/mapped-types';

export class CreateTopicDto extends OmitType(TopicModel, ['topic'] as const) {}
