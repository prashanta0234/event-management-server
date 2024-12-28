import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomCacheService } from 'src/common/custom-cache/custom-cache.service';
import { EventEmailQueueService } from 'src/common/queue/eventEmailQueue.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { formateDate } from 'src/utils/helpers';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CustomCacheService,
    private inviteEmailService: EventEmailQueueService,
  ) {}

  async createEvent(data: CreateEventDto): Promise<string> {
    const isExists = await this.cacheService.getEventByDate(data.date);
    if (isExists) {
      throw new BadRequestException('Already have an event in given day');
    }
    await this.prisma.event.create({ data });
    await this.cacheService.clearEventByDate(data.date);

    const attendees = await this.cacheService.getActiveAccounts();

    const formattedEventDate = formateDate(data.date);
    for (const user of attendees) {
      await this.inviteEmailService.addJob({
        to: user.email,
        eventDate: formattedEventDate,
        eventName: data.name,
        eventLink: 'https://meet.google.com/landing',
      });
    }
    return 'Event Created successfully';
  }
}
