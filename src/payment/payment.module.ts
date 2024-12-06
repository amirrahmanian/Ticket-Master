import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './providers/payment.service';
import { ConfigModule } from '@nestjs/config';
import paymentConfig from './config/payment.config';
import { RequestPaymentProvider } from './providers/request-payment.provider';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { VerifyPaymentProvider } from './providers/verify-payment.provider';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule.forFeature(paymentConfig),
    ScheduleModule.forRoot(),
    forwardRef(() => TicketsModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, RequestPaymentProvider, VerifyPaymentProvider],
  exports: [VerifyPaymentProvider],
})
export class PaymentModule {}
