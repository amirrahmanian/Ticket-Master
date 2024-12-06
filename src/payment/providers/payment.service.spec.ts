import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { RequestPaymentProvider } from './request-payment.provider';
import { VerifyPaymentProvider } from './verify-payment.provider';
import { LessThan, Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { TicketsService } from 'src/tickets/providers/tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VerifyPaymentQueryDto } from '../dtos/verify-payment-query.dto';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let requestPaymentProvider: RequestPaymentProvider;
  let verifyPaymentProvider: VerifyPaymentProvider;
  let paymentRepository: Repository<Payment>;
  let ticketsService: TicketsService;

  const mockRequestPaymentProvider = {
    requestPayment: jest.fn(),
  };

  const mockVerifyPaymentProvider = {
    verifyPayment: jest.fn(),
  };

  const mockPaymentRepository = {
    softDelete: jest.fn(),
  };

  const mockTicketsService = {
    deleteExpiredTickets: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: RequestPaymentProvider,
          useValue: mockRequestPaymentProvider,
        },
        {
          provide: VerifyPaymentProvider,
          useValue: mockVerifyPaymentProvider,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    requestPaymentProvider = module.get<RequestPaymentProvider>(
      RequestPaymentProvider,
    );
    verifyPaymentProvider = module.get<VerifyPaymentProvider>(
      VerifyPaymentProvider,
    );
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  describe('requestPayment', () => {
    it('should call requestPaymentProvider.requestPayment', async () => {
      const ticketId = 123;
      const user = { phoneNumber: '1234567890' };
      const result = { trackId: '12345', paymentUrl: 'https://example.com' };

      mockRequestPaymentProvider.requestPayment.mockResolvedValue(result);

      expect(await paymentService.requestPayment(ticketId, user)).toEqual(
        result,
      );
      expect(mockRequestPaymentProvider.requestPayment).toHaveBeenCalledWith(
        ticketId,
        user,
      );
    });
  });

  describe('verifyPayment', () => {
    it('should call verifyPaymentProvider.verifyPayment', async () => {
      const query: VerifyPaymentQueryDto = {
        trackId: '12345',
        status: 'success',
        success: 'true',
      };
      const result = { result: 'success' };

      mockVerifyPaymentProvider.verifyPayment.mockResolvedValue(result);

      expect(await paymentService.verifyPayment(query)).toEqual(result);
      expect(mockVerifyPaymentProvider.verifyPayment).toHaveBeenCalledWith(
        query,
      );
    });
  });

  describe('handleCron', () => {
    it('should delete expired payments and tickets', async () => {
      const thirtyMinutesAgo = new Date(Date.now() - 1000 * 60 * 30);

      mockPaymentRepository.softDelete.mockResolvedValue({ affected: 1 });

      await paymentService.handleCron();

      expect(mockPaymentRepository.softDelete).toHaveBeenCalledWith({
        paidAt: null,
        ticket: { createdAt: LessThan(thirtyMinutesAgo) },
      });
      expect(mockTicketsService.deleteExpiredTickets).toHaveBeenCalledWith(
        thirtyMinutesAgo,
      );
    });
  });
});
