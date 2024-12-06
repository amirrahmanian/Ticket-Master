import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import paymentConfig from '../config/payment.config';
import axios from 'axios';
import { TicketsService } from 'src/tickets/providers/tickets.service';
import { Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequestPaymentProvider {
  constructor(
    @Inject(paymentConfig.KEY)
    private paymentConfiguration: ConfigType<typeof paymentConfig>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @Inject(forwardRef(() => TicketsService))
    private ticketsService: TicketsService,
  ) {}

  /** =============== */
  async requestPayment(ticketId: number, user: any) {
    const ticket = await this.ticketsService.findById(
      ticketId,
      user.phoneNumber,
    );

    if (!ticket) throw new NotFoundException('ticket not found');

    try {
      if (ticket?.payment?.authority) {
        const trackId = ticket.payment.authority;
        const paymentUrl = `${this.paymentConfiguration.paymentUrl}/${trackId}`;
        return { trackId, paymentUrl };
      }
      const response = await axios.post(this.paymentConfiguration.requestUrl, {
        merchant: this.paymentConfiguration.merchantId,
        amount: ticket.travel.price,
        callbackUrl: this.paymentConfiguration.callBackUrl,
        description: 'ticket reserve',
      });
      await this.paymentRepository.insert({
        authority: response.data.trackId,
        amount: ticket.travel.price,
        ticket: { id: ticketId },
      });
      if (response.data.result === 100) {
        const trackId = String(response.data.trackId);
        const paymentUrl = `${this.paymentConfiguration.paymentUrl}/${trackId}`;
        return { trackId, paymentUrl };
      } else {
        throw new Error('please check your internet connection');
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
