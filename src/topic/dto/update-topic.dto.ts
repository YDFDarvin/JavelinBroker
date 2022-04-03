import { CreateTopicDto } from './create-topic.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  id: number;
}
