import { TicketType } from '@prisma/client';

export class ReserveSpotsDto {
  spots: string[];
  ticketType: TicketType;
  email: string;
}
