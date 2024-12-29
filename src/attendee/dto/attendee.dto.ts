import { ApiProperty } from '@nestjs/swagger';

export class AttendeeDto {
  @ApiProperty({ example: 'Prashanta Chakraborty' })
  name: string;
  @ApiProperty({ example: 'prashanta@gmail.com' })
  email: string;
}
