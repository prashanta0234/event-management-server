import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfirmEmailQueueService } from './confimEmailQueue.service';
import { EventEmailQueueService } from './eventEmailQueue.service';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: 'confirmAccount' },
      { name: 'eventNotificationQueue' },
    ),
  ],
  providers: [ConfirmEmailQueueService, EventEmailQueueService],
  exports: [ConfirmEmailQueueService, EventEmailQueueService],
})
export class QueueModule {}
