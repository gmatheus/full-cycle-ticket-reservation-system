import { TicketType } from '@prisma/client';

export class ReserveSpotsRequest {
  spots: string[];
  ticketType: TicketType;
  email: string;
}
