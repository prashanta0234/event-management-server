import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfirmEmailQueueService } from './confimEmailQueue.service';
import { EventEmailQueueService } from './eventEmailQueue.service';
import { ThanksEmailQueueService } from './thanksEmailQueue.service';
import { ReminderEmailQueueService } from './reminderEmailQueue.service';

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
      { name: 'reminderEmail' },
    ),
  ],
  providers: [
    ConfirmEmailQueueService,
    EventEmailQueueService,
    ThanksEmailQueueService,
    ReminderEmailQueueService,
  ],
  exports: [
    ConfirmEmailQueueService,
    EventEmailQueueService,
    ThanksEmailQueueService,
    ReminderEmailQueueService,
  ],
})
export class QueueModule {}
