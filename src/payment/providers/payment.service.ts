import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RequestPaymentProvider } from './request-payment.provider';
import { VerifyPaymentProvider } from './verify-payment.provider';
import { VerifyPaymentQueryDto } from '../dtos/verify-payment-query.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IsNull, LessThan, Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketsService } from 'src/tickets/providers/tickets.service';

@Injectable()
export class PaymentService {
  constructor(
    private requestPaymentProvider: RequestPaymentProvider,
    private verifyPaymentProvider: VerifyPaymentProvider,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  async requestPayment(ticketId: number, user: any) {
    return this.requestPaymentProvider.requestPayment(ticketId, user);
  }

  async verifyPayment(query: VerifyPaymentQueryDto) {
    return await this.verifyPaymentProvider.verifyPayment(query);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    const thirtyMinutesAgo = new Date(Date.now() - 1000 * 60 * 30);

    const { affected } = await this.paymentRepository.softDelete({
      paidAt: IsNull(),
      ticket: { createdAt: LessThan(thirtyMinutesAgo) },
    });

    if (affected > 0)
      await this.ticketsService.deleteExpiredTickets(thirtyMinutesAgo);
  }
}
