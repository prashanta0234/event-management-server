import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiResponseShape } from 'src/common/dto/apiResponse.dto';
import { CreateEventDto } from './dto/createEvent.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decoretor/roles.decoretor';
import { Role } from 'src/utils/types';
import { RolesGuard } from 'src/auth/guard/authGuard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: ApiResponseShape })
  @ApiOperation({
    description: 'Create Event',
  })
  async createEvent(@Body() data: CreateEventDto): Promise<string> {
    return await this.eventService.createEvent(data);
  }
}
