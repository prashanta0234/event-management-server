import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReminderEmailQueueService } from 'src/common/queue/reminderEmailQueue.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly reminderEmail: ReminderEmailQueueService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const tomorrowStart = new Date();
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
    tomorrowStart.setUTCHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setUTCHours(23, 59, 59, 999);

    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: tomorrowStart.toISOString(),
          lte: tomorrowEnd.toISOString(),
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
          eventDate: event.date.toISOString(),
          eventLink: `https://meet.google.com/landing`,
        });
      }
    }
  }
}
