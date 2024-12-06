import { Test, TestingModule } from '@nestjs/testing';
import { RequestPaymentProvider } from './request-payment.provider';
import { TicketsService } from 'src/tickets/providers/tickets.service';
import { Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RequestPaymentProvider', () => {
  let requestPaymentProvider: RequestPaymentProvider;
  let ticketsService: TicketsService;
  let paymentRepository: Repository<Payment>;

  const mockTicketsService = {
    findById: jest.fn(),
  };

  const mockPaymentRepository = {
    insert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestPaymentProvider,
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    requestPaymentProvider = module.get<RequestPaymentProvider>(
      RequestPaymentProvider,
    );
    ticketsService = module.get<TicketsService>(TicketsService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
  });

  it('should be defined', () => {
    expect(requestPaymentProvider).toBeDefined();
  });

  describe('requestPayment', () => {
    it('should throw NotFoundException if ticket is not found', async () => {
      mockTicketsService.findById.mockResolvedValue(null);

      await expect(
        requestPaymentProvider.requestPayment(1, {}),
      ).rejects.toThrow('ticket not found');
    });
  });
});
