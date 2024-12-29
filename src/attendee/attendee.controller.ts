import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { AttendeeDto } from './dto/attendee.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  ApiResponseAttendee,
  ApiResponseAttendees,
} from 'src/common/dto/apiResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/authGuard';
import { Roles } from 'src/auth/decoretor/roles.decoretor';
import { Role } from 'src/utils/types';

@Controller('attendees')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiCreatedResponse({ type: ApiResponseAttendees })
  @ApiOperation({
    description: 'Get all Attendee',
  })
  async getAttendees(): Promise<AttendeeDto[]> {
    return await this.attendeeService.getAllActiveAttendee();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: ApiResponseAttendee })
  @ApiOperation({
    description: 'Get Attendee by id',
  })
  async getAttendee(@Param('id') id: string): Promise<AttendeeDto> {
    return await this.attendeeService.getAttendeeById(id);
  }
}
