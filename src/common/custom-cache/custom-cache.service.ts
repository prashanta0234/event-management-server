import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AttendeeDto } from 'src/attendee/dto/attendee.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventEntity } from 'src/event/entity/eventEntity';

@Injectable()
export class CustomCacheService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value as T, ttl ?? +process.env.REDIS_TTL);
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.cache.get(key);
    return value as T;
  }

  async remove(key: string) {
    await this.cache.del(key);
  }

  async getActiveAccounts(): Promise<AttendeeDto[]> {
    const cachedData = await this.cache.get<AttendeeDto[]>('attendees');
    if (cachedData) {
      return cachedData;
    }

    const activeAccounts = await this.prisma.attendee.findMany({
      where: { isActivate: true },
      select: { name: true, email: true },
    });

    await this.cache.set('attendees', activeAccounts);
    return activeAccounts;
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
}
