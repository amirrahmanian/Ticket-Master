import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PaymentService } from './providers/payment.service';
import { VerifyPaymentQueryDto } from './dtos/verify-payment-query.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('request')
  @Auth(AuthType.PASSENGER)
  @ApiOperation({
    summary: 'Initiate a payment request',
    description: 'Creates a payment request for a specific ticket.',
  })
  @ApiBody({
    description: 'Ticket ID for which the payment is being requested',
    schema: {
      type: 'object',
      properties: {
        ticketId: { type: 'integer', example: 123 },
      },
    },
  })
  create(@Body('ticketId', ParseIntPipe) ticketId: number, @User() user: any) {
    return this.paymentService.requestPayment(ticketId, user);
  }

  @Get('verify')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Verify payment status',
    description: 'Verifies the status of a payment transaction.',
  })
  @ApiQuery({
    name: 'trackId',
    description: 'Tracking ID of the payment transaction',
    example: '1234567890',
  })
  @ApiQuery({
    name: 'status',
    description: 'Status of the payment',
    example: 'success',
  })
  @ApiQuery({
    name: 'success',
    description: 'Indicates whether the payment was successful',
    example: 'true',
  })
  verifyPayment(@Query() query: VerifyPaymentQueryDto) {
    return this.paymentService.verifyPayment(query);
  }
}
