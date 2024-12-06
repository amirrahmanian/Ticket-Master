import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payment/payment.entity';
import { VerifyPaymentProvider } from 'src/payment/providers/verify-payment.provider';
import { PaymentStatus } from 'src/payment/enums/payment.enum';

@Injectable()
export class TicketCancleProvider {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @Inject(forwardRef(() => VerifyPaymentProvider))
    private verifyPaymentProvider: VerifyPaymentProvider,
  ) {}

  async ticketCancle(id: number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const ticket = await this.ticketRepository.findOne({
      where: { id, passenger: { phoneNumber: user.phoneNumber } },
      relations: { payment: true, travel: true },
      select: ['id', 'travel', 'payment'],
    });
    if (!ticket) throw new NotFoundException('ticket not found');

    try {
      const oneHourBeforMove = +ticket.travel.date - 1000 * 60 * 60;

      if (ticket.travel.date < new Date())
        throw new Error('travel time is finished');

      const { affected: deleteAffected } = await queryRunner.manager.delete(
        Ticket,
        {
          id,
        },
      );
      if (deleteAffected === 0) throw new Error('editing failed');

      const { affected: updateAffected } = await queryRunner.manager.update(
        Payment,
        {
          id: ticket.payment.id,
        },
        { status: PaymentStatus.Refunded },
      );
      if (updateAffected === 0) throw new Error('editing failed');

      let price: number;
      if (oneHourBeforMove < Date.now() && ticket.travel.date > new Date()) {
        price = Math.floor(ticket.payment.amount / 2);
      } else {
        price = Math.floor((ticket.payment.amount / 10) * 9);
      }

      if (!price) throw new Error('somthing went wrong');

      const resualt = await this.verifyPaymentProvider.handleRefund(
        ticket.payment.authority,
        price,
      );

      if (!resualt) throw new Error('refund failed');

      await queryRunner.commitTransaction();
      return resualt;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(String(err));
    } finally {
      await queryRunner.release();
    }
  }
}
