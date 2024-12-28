import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'Name for the event' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Description for the event' })
  description?: string;
  @ApiProperty({ description: 'Date of the event' })
  @IsNotEmpty()
  @IsDateString()
  date: Date;
  @ApiProperty({ description: 'Location for the event' })
  location?: string;
}
