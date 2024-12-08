import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import paymentConfig from '../config/payment.config';
import { PaymentStatus } from '../enums/payment.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { VerifyPaymentQueryDto } from '../dtos/verify-payment-query.dto';

@Injectable()
export class VerifyPaymentProvider {
  constructor(
    @Inject(paymentConfig.KEY)
    private paymentConfiguration: ConfigType<typeof paymentConfig>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {}
  /** =============== */
  async verifyPayment(query: VerifyPaymentQueryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const order = await this.paymentRepository.findOneBy({
      authority: query.trackId,
    });

    if (!order) throw new NotFoundException('order not found');

    try {
      const verifyResponse = await axios.post(
        this.paymentConfiguration.verifyUrl,
        {
          merchant: this.paymentConfiguration.merchantId,
          trackId: query.trackId,
        },
      );

      if (verifyResponse.data.result === 100) {
        await queryRunner.manager.update(Payment, order.id, {
          status: PaymentStatus.Success,
          paidAt: verifyResponse.data.paidAt,
        });
      } else if (verifyResponse.data.result === 202) {
        await queryRunner.manager.update(Payment, order.id, {
          status: PaymentStatus.Failed,
        });
      }

      await queryRunner.commitTransaction();
      return verifyResponse.data;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.handleRefund(query.trackId, order.amount);

      throw new InternalServerErrorException(String(err));
    } finally {
      await queryRunner.release();
    }
  }

  async handleRefund(authority: string, amount: number) {
    try {
      const res = await axios.post(this.paymentConfiguration.refundUrl, {
        trackId: +authority,
        amount,
      });

      return res.result === 1 ? true : false;
    } catch (refundError) {
      throw new Error(String(refundError));
    }
  }
}
