import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomCacheService } from 'src/common/custom-cache/custom-cache.service';
import { AttendeeDto } from './dto/attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CustomCacheService,
  ) {}

  async getAllActiveAttendee(): Promise<AttendeeDto[]> {
    const cachedData = await this.cacheService.get<AttendeeDto[]>('attendees');
    if (cachedData) {
      return cachedData;
    }

    const activeAccounts = await this.prisma.attendee.findMany({
      where: { isActivate: true },
      select: { name: true, email: true },
    });

    await this.cacheService.set('attendees', activeAccounts);
    return activeAccounts;
  }

  async getAttendeeById(id: string): Promise<AttendeeDto> {
    const cachedData = await this.cacheService.get<AttendeeDto>(id);

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
    await this.cacheService.set(id, data);
    return data;
  }
}
