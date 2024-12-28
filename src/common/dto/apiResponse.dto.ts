import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from 'src/event/entity/eventEntity';

export class ApiResponseShape {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  })
  data: {
    accessToken: string;
  };
}

export class ApiResponseCreateEvent {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: 'Event Created successfully',
  })
  data: string;
}

export class ApiResponseGetEvent {
  @ApiProperty({
    example: true,
    description: 'Indicates if the API call was successful.',
  })
  ok: boolean;

  @ApiProperty({
    example: 200,
    description: 'The HTTP status code of the response.',
  })
  statusCode: number;

  @ApiProperty({
    type: [EventEntity],
    description: 'An array of events retrieved from the database.',
  })
  data: EventEntity[];
}

export class ApiResponseRegistrationEvent {
  @ApiProperty({ example: true })
  ok: boolean;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: 'Event Registration successfully',
  })
  data: string;
}
