import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginDto, RegisterAttendeeDto } from './dto';
import { ApiResponseShape } from 'src/common/dto/apiResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
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

  @SkipThrottle({ default: false })
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

  @SkipThrottle({ default: false })
  @Post('admin/login')
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Login Admin',
  })
  async loginAdmin(@Body() data: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.adminLogin(data);
  }

  @SkipThrottle({ default: false })
  @Post('active-account')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Activate user account',
  })
  @UseGuards(AuthGuard('jwt'))
  async activeAccount(@Query('token') token: string, @Req() req: any) {
    const email = req.user.email;
    return this.authService.validateOtp(email, token);
  }
}
