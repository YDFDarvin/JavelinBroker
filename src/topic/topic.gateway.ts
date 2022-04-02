import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@WebSocketGateway()
export class TopicGateway {
  constructor(private readonly topicService: TopicService) {}

  @SubscribeMessage('createTopic')
  create(@MessageBody() createTopicDto: CreateTopicDto) {
    return this.topicService.create(createTopicDto);
  }

  @SubscribeMessage('findAllTopic')
  findAll() {
    return this.topicService.findAll();
  }

  @SubscribeMessage('findOneTopic')
  findOne(@MessageBody() id: number) {
    return this.topicService.findOne(id);
  }

  @SubscribeMessage('updateTopic')
  update(@MessageBody() updateTopicDto: UpdateTopicDto) {
    return this.topicService.update(updateTopicDto.id, updateTopicDto);
  }

  @SubscribeMessage('removeTopic')
  remove(@MessageBody() id: number) {
    return this.topicService.remove(id);
  }
}
