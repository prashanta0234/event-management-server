import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfirmEmailQueueService } from './confimEmailQueue.service';
import { EventEmailQueueService } from './eventEmailQueue.service';
import { ThanksEmailQueueService } from './thanksEmailQueue.service';

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
      { name: 'thanksEmail' },
    ),
  ],
  providers: [
    ConfirmEmailQueueService,
    EventEmailQueueService,
    ThanksEmailQueueService,
  ],
  exports: [
    ConfirmEmailQueueService,
    EventEmailQueueService,
    ThanksEmailQueueService,
  ],
})
export class QueueModule {}
