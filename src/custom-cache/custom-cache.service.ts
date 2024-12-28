import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventEntity } from 'src/event/entity/eventEntity';
import { Attendee } from 'src/utils/types';

@Injectable()
export class CustomCacheService {
  private readonly attendeeCacheKey = 'active_attendee';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async getActiveAccounts(): Promise<Attendee[]> {
    const cachedData = await this.cache.get<Attendee[]>(this.attendeeCacheKey);
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

  async clearEventByDate(date: Date): Promise<void> {
    await this.cache.del(date.toString());
  }

  async clearActiveAccountsCache(): Promise<void> {
    await this.cache.del(this.attendeeCacheKey);
  }
}
