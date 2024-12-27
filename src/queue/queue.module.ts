import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfirmEmailQueueService } from './confimEmailQueue.service';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'confirmAccount' }),
  ],
  providers: [ConfirmEmailQueueService],
  exports: [ConfirmEmailQueueService],
})
export class QueueModule {}
