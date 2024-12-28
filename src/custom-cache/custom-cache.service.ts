import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
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

    await this.cache.set(this.attendeeCacheKey, activeAccounts, 600);
    return activeAccounts;
  }

  async clearActiveAccountsCache(): Promise<void> {
    await this.cache.del(this.attendeeCacheKey);
  }
}
