import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiResponseCreateEvent,
  ApiResponseGetEvent,
} from 'src/common/dto/apiResponse.dto';
import { CreateEventDto } from './dto/createEvent.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decoretor/roles.decoretor';
import { Role } from 'src/utils/types';
import { RolesGuard } from 'src/auth/guard/authGuard';
import { EventEntity } from './entity/eventEntity';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: ApiResponseCreateEvent })
  @ApiOperation({
    description: 'Create Event',
  })
  async createEvent(@Body() data: CreateEventDto): Promise<string> {
    return await this.eventService.createEvent(data);
  }

  @Get()
  @ApiCreatedResponse({ type: ApiResponseGetEvent })
  @ApiOperation({
    description: 'Get all Event',
  })
  async getEvents(): Promise<EventEntity[]> {
    return await this.eventService.getEvents();
  }
}
