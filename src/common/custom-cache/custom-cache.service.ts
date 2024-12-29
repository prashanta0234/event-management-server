import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AttendeeDto } from 'src/attendee/dto/attendee.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventEntity } from 'src/event/entity/eventEntity';

@Injectable()
export class CustomCacheService {
  private readonly attendeeCacheKey = 'active_attendee';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getActiveAccounts(): Promise<AttendeeDto[]> {
    const cachedData = await this.cache.get<AttendeeDto[]>(
      this.attendeeCacheKey,
    );
    if (cachedData) {
      return cachedData;
    }

    const activeAccounts = await this.prisma.attendee.findMany({
      where: { isActivate: true },
      select: { name: true, email: true },
    });

    await this.cache.set(this.attendeeCacheKey, activeAccounts);
    return activeAccounts;
  }

  async getEventByDate(date: Date): Promise<EventEntity> {
    const key = date.toString();

    const cachedData = await this.cache.get<EventEntity>(key);

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
    await this.cache.set(key, data);
    return data;
  }

  async getEventById(id: string): Promise<EventEntity> {
    const cachedData = await this.cache.get<EventEntity>(id);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      return;
    }
    await this.cache.set(id, data);
    return data;
  }

  async getEvents(): Promise<EventEntity[]> {
    const key = 'allEvents';
    const cachedData = await this.cache.get<EventEntity[]>(key);
    if (cachedData) {
      return cachedData;
    }

    const events = await this.prisma.event.findMany();

    await this.cache.set(key, events);
    return events;
  }

  async clearEvents(): Promise<void> {
    const key = 'allEvents';
    await this.cache.del(key);
  }

  async clearEventById(id: string): Promise<void> {
    await this.cache.del(id);
  }

  async clearEventByDate(date: Date): Promise<void> {
    await this.cache.del(date.toString());
  }

  async clearActiveAccountsCache(): Promise<void> {
    await this.cache.del(this.attendeeCacheKey);
  }
  async getAttendeeById(id: string): Promise<AttendeeDto> {
    const cachedData = await this.cache.get<AttendeeDto>(id);

    if (cachedData) {
      return cachedData;
    }

    const data = await this.prisma.attendee.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      return;
    }
    await this.cache.set(id, data);
    return data;
  }
}
