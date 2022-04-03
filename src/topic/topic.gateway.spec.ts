import { TopicGateway } from './topic.gateway';
import { TopicService } from './topic.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TopicGateway', () => {
  let gateway: TopicGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicGateway, TopicService],
    }).compile();

    gateway = module.get<TopicGateway>(TopicGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
