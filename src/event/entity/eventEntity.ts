import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';

export class EventEntity implements Event {
  @ApiProperty({
    example: 'f14c76ad-77d4-4c9b-9394-527e575489d3',
    description: 'The unique identifier of the event.',
  })
  readonly id: string;

  @ApiProperty({
    example: '2024-12-29T17:45:03.000Z',
    description: 'The date and time of the event in ISO format.',
  })
  readonly date: Date;

  @ApiProperty({
    example: 'An exciting networking event.',
    description: 'The description of the event.',
  })
  readonly description: string;

  @ApiProperty({
    example: 'Tech Meetup 2024',
    description: 'The name of the event.',
  })
  readonly name: string;

  @ApiProperty({
    example: 'Dhaka, Bangladesh',
    description: 'The location where the event will take place.',
  })
  readonly location: string;

  @ApiProperty({
    example: 100,
    description: 'The maximum number of attendees allowed for the event.',
  })
  readonly maxAttendees: number;

  @ApiProperty({
    example: '2023-12-28T12:00:00.000Z',
    description: 'The timestamp when the event was created.',
  })
  readonly createdAt: Date;
}
