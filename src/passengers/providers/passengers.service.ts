import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Passenger } from '../passenger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EditPassengerDto } from '../dtos/edit-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  async findByUniqueCode(phoneNumber: string, nationalCode: string) {
    return await this.passengerRepository.findOne({
      where: {
        phoneNumber,
        nationalCode,
      },
      select: ['id'],
    });
  }

  async editPassenger(
    id: number,
    editPassengerDto: EditPassengerDto,
    user: any,
  ) {
    try {
      const result = await this.passengerRepository.update(
        { id, phoneNumber: user.phoneNumber },
        {
          ...editPassengerDto,
          birthDate: new Date(editPassengerDto.birthDate),
        },
      );

      if (result.affected === 0) {
        throw new Error('entered passenger id is wrong');
      }

      return result;
    } catch (err) {
      throw new BadRequestException(String(err));
    }
  }
}
