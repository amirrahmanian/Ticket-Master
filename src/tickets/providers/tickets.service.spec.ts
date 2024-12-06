import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { TicketReserveProvider } from './ticket-reserve.provider';
import { TicketCancleProvider } from './ticket-cancle.provider';
import { TicketReserveDto } from '../dtos/ticket-reserve.dto';
import { Gender } from 'src/common/enums/common.enum';

describe('TicketsService', () => {
  let ticketsService: TicketsService;
  let ticketReserveProvider: TicketReserveProvider;
  let ticketCancleProvider: TicketCancleProvider;

  const mockTicketReserveProvider = {
    ticketReserve: jest.fn(),
  };

  const mockTicketCancleProvider = {
    ticketCancle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: TicketReserveProvider,
          useValue: mockTicketReserveProvider,
        },
        {
          provide: TicketCancleProvider,
          useValue: mockTicketCancleProvider,
        },
      ],
    }).compile();

    ticketsService = module.get<TicketsService>(TicketsService);
    ticketReserveProvider = module.get<TicketReserveProvider>(
      TicketReserveProvider,
    );
    ticketCancleProvider =
      module.get<TicketCancleProvider>(TicketCancleProvider);
  });

  it('should be defined', () => {
    expect(ticketsService).toBeDefined();
  });

  describe('ticketReserve', () => {
    it('should call ticketReserveProvider.ticketReserve', async () => {
      const dto: TicketReserveDto = {
        travelId: 1,
        reservedSeat: 5,
        phoneNumber: '1234567890',
        nationalCode: '1234567890',
        birthDate: Date.now(),
        family: 'testing',
        gender: Gender.MAIL,
        username: 'test',
      };
      const result = { success: true };

      mockTicketReserveProvider.ticketReserve.mockResolvedValue(result);

      expect(await ticketsService.ticketReserve(dto)).toEqual(result);
      expect(mockTicketReserveProvider.ticketReserve).toHaveBeenCalledWith(dto);
    });
  });

  describe('ticketCancle', () => {
    it('should call ticketCancleProvider.ticketCancle', async () => {
      const id = 1;
      const user = { phoneNumber: '123' };
      const result = { success: true };

      mockTicketCancleProvider.ticketCancle.mockResolvedValue(result);

      expect(await ticketsService.ticketCancle(id, user)).toEqual(result);
      expect(mockTicketCancleProvider.ticketCancle).toHaveBeenCalledWith(
        id,
        user,
      );
    });
  });
});
