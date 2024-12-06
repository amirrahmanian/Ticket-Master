import { Test, TestingModule } from '@nestjs/testing';
import { PassengersService } from './passengers.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Passenger } from '../passenger.entity';
import { EditPassengerDto } from '../dtos/edit-passenger.dto';
import { BadRequestException } from '@nestjs/common';
import { Gender } from 'src/common/enums/common.enum';

describe('PassengersService', () => {
  let passengersService: PassengersService;
  let passengerRepository: Repository<Passenger>;

  const mockPassengerRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PassengersService,
        {
          provide: getRepositoryToken(Passenger),
          useValue: mockPassengerRepository,
        },
      ],
    }).compile();

    passengersService = module.get<PassengersService>(PassengersService);
    passengerRepository = module.get<Repository<Passenger>>(
      getRepositoryToken(Passenger),
    );
  });

  it('should be defined', () => {
    expect(passengersService).toBeDefined();
  });

  describe('findByUniqueCode', () => {
    it('should return a passenger if found', async () => {
      const mockPassenger = { id: 1 };
      mockPassengerRepository.findOne.mockResolvedValue(mockPassenger);

      const result = await passengersService.findByUniqueCode(
        '1234567890',
        '123456789',
      );

      expect(passengerRepository.findOne).toHaveBeenCalledWith({
        where: { phoneNumber: '1234567890', nationalCode: '123456789' },
        select: ['id'],
      });
      expect(result).toEqual(mockPassenger);
    });

    it('should return null if no passenger is found', async () => {
      mockPassengerRepository.findOne.mockResolvedValue(null);

      const result = await passengersService.findByUniqueCode(
        '1234567890',
        '123456789',
      );

      expect(passengerRepository.findOne).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('editPassenger', () => {
    const mockUser = { phoneNumber: '1234567890' };
    const editPassengerDto: EditPassengerDto = {
      family: 'John',
      username: 'Doe',
      birthDate: Date.now(),
      gender: Gender.MAIL,
    };

    it('should update passenger details successfully', async () => {
      mockPassengerRepository.update.mockResolvedValue({ affected: 1 });

      const result = await passengersService.editPassenger(
        1,
        editPassengerDto,
        mockUser,
      );

      expect(passengerRepository.update).toHaveBeenCalledWith(
        { id: 1, phoneNumber: mockUser.phoneNumber },
        {
          ...editPassengerDto,
          birthDate: new Date(editPassengerDto.birthDate),
        },
      );
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw BadRequestException if no rows are affected', async () => {
      mockPassengerRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        passengersService.editPassenger(1, editPassengerDto, mockUser),
      ).rejects.toThrow(BadRequestException);

      expect(passengerRepository.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException on error', async () => {
      mockPassengerRepository.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        passengersService.editPassenger(1, editPassengerDto, mockUser),
      ).rejects.toThrow(BadRequestException);

      expect(passengerRepository.update).toHaveBeenCalled();
    });
  });
});
