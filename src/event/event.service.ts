import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomCacheService } from 'src/common/custom-cache/custom-cache.service';
import { EventEmailQueueService } from 'src/common/queue/eventEmailQueue.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { formateDate } from 'src/utils/helpers';
import { EventEntity } from './entity/eventEntity';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CustomCacheService,
    private inviteEmailService: EventEmailQueueService,
  ) {}

  async createEvent(data: CreateEventDto): Promise<string> {
    const isExists = await this.getEventByDate(data.date.toISOString());
    if (isExists) {
      throw new BadRequestException('Already have an event in given day');
    }
    await this.prisma.event.create({ data });
    await this.cacheService.remove(data.date.toISOString());
    await this.cacheService.remove('events');

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

  async getEventByDate(date: string): Promise<EventEntity> {
    const key = date.toString();

    const cachedData = await this.cacheService.get<EventEntity>(key);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.prisma.event.findUnique({
      where: {
        date: date,
      },
    });
    if (!data) {
      return;
    }
    await this.cacheService.set(key, data);
    return data;
  }

  async getEvents(): Promise<EventEntity[]> {
    const key = 'events';
    const cachedData = await this.cacheService.get<EventEntity[]>(key);
    if (cachedData) {
      return cachedData;
    }

    const events = await this.prisma.event.findMany();

    await this.cacheService.set(key, events);
    return events;
  }
  async getEvent(eventId: string): Promise<EventEntity> {
    const cachedData = await this.cacheService.get<EventEntity>(eventId);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!data) {
      return;
    }
    await this.cacheService.set(eventId, data);
    return data;
  }
}
