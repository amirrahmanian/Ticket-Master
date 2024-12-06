import { forwardRef, Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './providers/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TravelsModule } from 'src/travels/travels.module';
import { TicketReserveProvider } from './providers/ticket-reserve.provider';
import { PassengersModule } from 'src/passengers/passengers.module';
import { TicketCancleProvider } from './providers/ticket-cancle.provider';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    TravelsModule,
    PassengersModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketReserveProvider, TicketCancleProvider],
  exports: [TicketsService],
})
export class TicketsModule {}
