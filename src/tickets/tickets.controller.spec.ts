import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './providers/tickets.service';
import { TicketReserveDto } from './dtos/ticket-reserve.dto';
import { Gender } from 'src/common/enums/common.enum';

describe('TicketsController', () => {
  let ticketsController: TicketsController;
  let ticketsService: TicketsService;

  const mockTicketsService = {
    ticketReserve: jest.fn(),
    ticketCancle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    ticketsController = module.get<TicketsController>(TicketsController);
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(ticketsController).toBeDefined();
  });

  describe('ticketReserve', () => {
    it('should call ticketsService.ticketReserve with the correct parameters', async () => {
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
      mockTicketsService.ticketReserve.mockResolvedValue(result);

      expect(await ticketsController.ticketReserve(dto)).toEqual(result);
      expect(mockTicketsService.ticketReserve).toHaveBeenCalledWith(dto);
    });
  });

  describe('ticketCancle', () => {
    it('should call ticketsService.ticketCancle with the correct parameters', async () => {
      const id = 1;
      const user = { phoneNumber: '1234567890' };
      const result = { success: true };

      mockTicketsService.ticketCancle.mockResolvedValue(result);

      expect(await ticketsController.ticketCancle(id, user)).toEqual(result);
      expect(mockTicketsService.ticketCancle).toHaveBeenCalledWith(id, user);
    });
  });
});
