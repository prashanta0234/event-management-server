import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterAttendeeDto{
    @ApiProperty({ description: 'Name of the user.' })
	@IsString()
	@IsNotEmpty()
    name:string;

    @ApiProperty({description:"Valid email of the user."})
    @IsEmail()
    @IsNotEmpty()
    email:string
    
}