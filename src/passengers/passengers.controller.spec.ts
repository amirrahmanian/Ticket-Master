import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './providers/passengers.service';
import { EditPassengerDto } from './dtos/edit-passenger.dto';
import { BadRequestException } from '@nestjs/common';
import { Gender } from 'src/common/enums/common.enum';

describe('PassengersController', () => {
  let passengersController: PassengersController;
  let passengersService: PassengersService;

  const mockPassengersService = {
    editPassenger: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        {
          provide: PassengersService,
          useValue: mockPassengersService,
        },
      ],
    }).compile();

    passengersController =
      module.get<PassengersController>(PassengersController);
    passengersService = module.get<PassengersService>(PassengersService);
  });

  it('should be defined', () => {
    expect(passengersController).toBeDefined();
  });

  describe('editPassenger', () => {
    const mockUser = { phoneNumber: '1234567890' };
    const editPassengerDto: EditPassengerDto = {
      family: 'John',
      username: 'Doe',
      birthDate: Date.now(),
      gender: Gender.MAIL,
    };

    it('should call PassengersService.editPassenger with correct parameters', async () => {
      mockPassengersService.editPassenger.mockResolvedValue({ affected: 1 });

      const result = await passengersController.editPassenger(
        1,
        editPassengerDto,
        mockUser,
      );

      expect(passengersService.editPassenger).toHaveBeenCalledWith(
        1,
        editPassengerDto,
        mockUser,
      );
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw BadRequestException when service throws an error', async () => {
      mockPassengersService.editPassenger.mockRejectedValue(
        new BadRequestException('Invalid passenger ID'),
      );

      await expect(
        passengersController.editPassenger(1, editPassengerDto, mockUser),
      ).rejects.toThrow(BadRequestException);

      expect(passengersService.editPassenger).toHaveBeenCalledWith(
        1,
        editPassengerDto,
        mockUser,
      );
    });
  });
});
