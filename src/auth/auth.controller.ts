import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto, RegisterAttendeeDto } from './dto';
import { ApiResponseShape } from 'src/common/dto/apiResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Create Attendee',
  })
  async registrationAttendee(
    @Body() data: RegisterAttendeeDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.RegistrationAttendee(data);
  }

  @Post('login')
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Login Attendee',
  })
  async loginAttendee(
    @Body() data: LoginDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.LoginAttendee(data);
  }

  @Post('admin/login')
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Login Admin',
  })
  async loginAdmin(@Body() data: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.adminLogin(data);
  }
}
