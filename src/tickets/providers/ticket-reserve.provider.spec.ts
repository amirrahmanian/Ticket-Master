import { Test, TestingModule } from '@nestjs/testing';
import { TicketReserveProvider } from './ticket-reserve.provider';
import { Repository } from 'typeorm';
import { Ticket } from '../ticket.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TicketReserveProvider', () => {
  let ticketReserveProvider: TicketReserveProvider;
  let ticketRepository: Repository<Ticket>;

  const mockTicketRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketReserveProvider,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
      ],
    }).compile();

    ticketReserveProvider = module.get<TicketReserveProvider>(
      TicketReserveProvider,
    );
    ticketRepository = module.get<Repository<Ticket>>(
      getRepositoryToken(Ticket),
    );
  });

  it('should be defined', () => {
    expect(ticketReserveProvider).toBeDefined();
  });

  describe('validateReservedSeat', () => {
    it('should throw an error if the seat is already reserved', async () => {
      mockTicketRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        ticketReserveProvider.validateReservedSeat(1, 5),
      ).rejects.toThrow('this seat is allready reserved');
    });

    it('should not throw if the seat is available', async () => {
      mockTicketRepository.findOne.mockResolvedValue(null);

      await expect(
        ticketReserveProvider.validateReservedSeat(1, 5),
      ).resolves.not.toThrow();
    });
  });
});
