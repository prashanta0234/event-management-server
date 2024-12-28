import { Event } from '@prisma/client';

export class EventEntity implements Event {
  readonly id: string;
  readonly date: Date;
  readonly description: string;
  readonly name: string;
  readonly location: string;
  readonly maxAttendees: number;
  readonly createdAt: Date;
}
