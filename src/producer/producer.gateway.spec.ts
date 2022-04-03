import { ProducerGateway } from './producer.gateway';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProducerGateway', () => {
  let gateway: ProducerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerGateway],
    }).compile();

    gateway = module.get<ProducerGateway>(ProducerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
