import { registerAs } from '@nestjs/config';

export default registerAs('paymentConfig', () => ({
  merchantId: process.env.ZIBAL_MERCHANT_ID,
  requestUrl: process.env.ZIBAL_REQUEST_URL,
  verifyUrl: process.env.ZIBAL_VERIFY_URL,
  callBackUrl: process.env.ZIBAL_CALL_BACK_URL,
  paymentUrl: process.env.ZIBAL_PAYMENT_URL,
  refundUrl: process.env.ZIBAL_REFUND_URL,
}));
