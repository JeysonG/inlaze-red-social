import { Process, Processor } from '@nestjs/bull';
import { VERIFY_EMAIL_QUEUE, VERIFY_EMAIL_SERVICE } from './auth/constants';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ClientKafka } from '@nestjs/microservices';

@Processor(VERIFY_EMAIL_QUEUE)
export class VerifyEmailQueueConsumer {
  private readonly logger = new Logger(VerifyEmailQueueConsumer.name);

  constructor(
    @Inject(VERIFY_EMAIL_SERVICE)
    private readonly verifyEmailClient: ClientKafka,
  ) {}

  @Process()
  async verifyEmailQueue(job: Job<unknown>) {
    this.verifyEmailClient.emit('verify_email', job.data);
    this.logger.log(`Transaction complete for job: ${job.id}`);
  }
}
