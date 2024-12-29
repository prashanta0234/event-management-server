import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReminderEmailQueueService } from 'src/common/queue/reminderEmailQueue.service';
import { formateDate } from 'src/utils/helpers';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly reminderEmail: ReminderEmailQueueService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now);
    twentyFourHoursFromNow.setHours(now.getHours() + 24);

    twentyFourHoursFromNow.setSeconds(0, 0);

    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: twentyFourHoursFromNow.toISOString(),
          lte: new Date(twentyFourHoursFromNow.getTime() + 60000).toISOString(),
        },
      },
      include: {
        registrations: {
          include: {
            attendee: true,
          },
        },
      },
    });

    for (const event of events) {
      for (const registration of event.registrations) {
        const attendeeEmail = registration.attendee.email;
        await this.reminderEmail.addJob({
          to: attendeeEmail,
          eventName: event.name,
          eventDate: formateDate(event.date),
          eventLink: `https://meet.google.com/landing`,
        });
      }
    }
  }
}
