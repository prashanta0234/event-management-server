import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterEventDto {
  @ApiProperty({ description: 'Event Id' })
  @IsNotEmpty()
  eventId: string;
}
