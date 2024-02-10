import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/services/consumer.service';

@Injectable()
export class FakeMSConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: ['verify-email'],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
}
