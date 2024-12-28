import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomCacheService } from 'src/custom-cache/custom-cache.service';
import { ThanksEmailQueueService } from 'src/queue/thanksEmailQueue.service';
import { formateDate } from 'src/utils/helpers';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CustomCacheService,
    private readonly thanksQueue: ThanksEmailQueueService,
  ) {}

  async attendeeRegistration({
    email,
    id,
  }: {
    email: string;
    id: string;
  }): Promise<string> {
    const event = await this.cacheService.getEventById(id);
    if (!event) {
      throw new NotFoundException('Event not found!');
    }

    const user = await this.prisma.attendee.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        eventId_attendeeId: {
          eventId: id,
          attendeeId: user.id,
        },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('User already registered for this event.');
    }

    const registrationCount = await this.prisma.registration.count({
      where: {
        eventId: id,
      },
    });

    if (registrationCount >= event.maxAttendees) {
      throw new ConflictException(
        'Registration limit exceeded for this event.',
      );
    }

    await this.prisma.registration.create({
      data: {
        eventId: id,
        attendeeId: user.id,
      },
    });

    const formattedEventDate = formateDate(event.date);

    this.thanksQueue.addJob({
      to: user.email,
      eventDate: formattedEventDate,
      eventName: event.name,
      eventLink: 'https://meet.google.com/landing',
    });

    return `User successfully registered for the event: ${event.name}`;
  }
}
