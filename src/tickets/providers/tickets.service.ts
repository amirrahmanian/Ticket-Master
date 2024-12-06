import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketReserveProvider } from './ticket-reserve.provider';
import { TicketReserveDto } from '../dtos/ticket-reserve.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../ticket.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { TicketCancleProvider } from './ticket-cancle.provider';

@Injectable()
export class TicketsService {
  constructor(
    private ticketReserveProvider: TicketReserveProvider,
    private ticketCancleProvider: TicketCancleProvider,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
  ) {}

  async ticketReserve(ticketReserveDto: TicketReserveDto) {
    return await this.ticketReserveProvider.ticketReserve(ticketReserveDto);
  }

  async ticketCancle(id: number, user: any) {
    return await this.ticketCancleProvider.ticketCancle(id, user);
  }

  async findById(id: number, phoneNumber: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, passenger: { phoneNumber } },
      relations: { payment: true, travel: true },
    });
    if (!ticket) throw new NotFoundException('ticket not found');
    return ticket;
  }

  async deleteExpiredTickets(thirtyMinutesAgo: Date) {
    this.ticketRepository.softDelete({
      payment: { paidAt: IsNull() },
      createdAt: LessThan(thirtyMinutesAgo),
    });
  }
}
