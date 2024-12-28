import { Controller, Get } from '@nestjs/common';
import { AttendeeService } from './attendee.service';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  async getAttendee() {
    return await this.attendeeService.getAllActiveAttendee();
  }
}
