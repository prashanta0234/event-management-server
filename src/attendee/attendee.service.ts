import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomCacheService } from 'src/custom-cache/custom-cache.service';
import { Attendee } from 'src/utils/types';

@Injectable()
export class AttendeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CustomCacheService,
  ) {}

  async getAllActiveAttendee(): Promise<Attendee[]> {
    const data = await this.cacheService.getActiveAccounts();
    return data;
  }
}
