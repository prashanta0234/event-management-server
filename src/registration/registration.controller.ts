import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/authGuard';
import { Roles } from 'src/auth/decoretor/roles.decoretor';
import { Role } from 'src/utils/types';
import { ApiResponseShape } from 'src/common/dto/apiResponse.dto';
import { RegisterEventDto } from './dto/registrationEvent.dto';

@ApiTags('event')
@Controller('event/registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.User)
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Event registration',
  })
  async attendeeRegistration(@Body() data: RegisterEventDto, @Req() req: any) {
    const email = req.user.email;

    return await this.registrationService.attendeeRegistration({
      email: email,
      id: data.eventId,
    });
  }
}
