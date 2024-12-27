import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { RegisterAttendeeDto } from './dto';
import { ApiResponseShape } from 'src/common/dto/apiResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Create Attendee',
  })
  async registrationAttendee(
    @Body() data: RegisterAttendeeDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.RegistrationAttendee(data);
  }
}
