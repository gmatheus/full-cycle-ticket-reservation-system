import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from '@app/core/events/events.service';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';
import { ReserveSpotsRequest } from './request/reserve-spot.request';
import { AuthGuard } from '@app/core/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventRequest: CreateEventRequest) {
    return this.eventsService.create(createEventRequest);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventRequest: UpdateEventRequest,
  ) {
    return this.eventsService.update(id, updateEventRequest);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/reserve')
  reserveSpots(
    @Param('id') id: string,
    @Body() reserveSpotsRequest: ReserveSpotsRequest,
  ) {
    return this.eventsService.reserveSpots(id, reserveSpotsRequest);
  }
}
