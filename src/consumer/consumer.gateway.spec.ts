import { ConsumerGateway } from './consumer.gateway';
import { Test, TestingModule } from '@nestjs/testing';

describe('ConsumerGateway', () => {
  let gateway: ConsumerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerGateway],
    }).compile();

    gateway = module.get<ConsumerGateway>(ConsumerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
