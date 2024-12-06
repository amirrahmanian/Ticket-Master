import { Test, TestingModule } from '@nestjs/testing';
import { TicketCancleProvider } from './ticket-cancle.provider';
import { Repository } from 'typeorm';
import { Ticket } from '../ticket.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TicketCancleProvider', () => {
  let ticketCancleProvider: TicketCancleProvider;
  let ticketRepository: Repository<Ticket>;

  const mockTicketRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketCancleProvider,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
      ],
    }).compile();

    ticketCancleProvider =
      module.get<TicketCancleProvider>(TicketCancleProvider);
    ticketRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
  });

  it('should be defined', () => {
    expect(ticketCancleProvider).toBeDefined();
  });

  describe('ticketCancle', () => {
    it('should throw an error if the ticket is not found', async () => {
      mockTicketRepository.findOne.mockResolvedValue(null);

      await expect(
        ticketCancleProvider.ticketCancle(1, { phoneNumber: '123' }),
      ).rejects.toThrow('ticket not found');
    });
  });
});
