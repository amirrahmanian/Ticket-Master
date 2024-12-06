import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './providers/payment.service';
import { VerifyPaymentQueryDto } from './dtos/verify-payment-query.dto';

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  const mockPaymentService = {
    requestPayment: jest.fn(),
    verifyPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    paymentController = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
  });

  describe('create', () => {
    it('should call paymentService.requestPayment with correct params', async () => {
      const ticketId = 123;
      const user = { phoneNumber: '1234567890' };
      const result = { trackId: '12345', paymentUrl: 'https://example.com' };

      mockPaymentService.requestPayment.mockResolvedValue(result);

      expect(await paymentController.create(ticketId, user)).toEqual(result);
      expect(mockPaymentService.requestPayment).toHaveBeenCalledWith(
        ticketId,
        user,
      );
    });
  });

  describe('verifyPayment', () => {
    it('should call paymentService.verifyPayment with correct params', async () => {
      const query: VerifyPaymentQueryDto = {
        trackId: '12345',
        status: 'success',
        success: 'true',
      };
      const result = { result: 'success' };

      mockPaymentService.verifyPayment.mockResolvedValue(result);

      expect(await paymentController.verifyPayment(query)).toEqual(result);
      expect(mockPaymentService.verifyPayment).toHaveBeenCalledWith(query);
    });
  });
});
