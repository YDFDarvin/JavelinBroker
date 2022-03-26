import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerGateway } from './producer/producer.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProducerGateway],
})
export class AppModule {}
