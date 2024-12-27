import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAttendeeDto {
  @ApiProperty({ description: 'Name of the user.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Valid email of the user.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Valid user password.', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}
