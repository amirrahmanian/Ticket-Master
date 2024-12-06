import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketReserveDto } from '../dtos/ticket-reserve.dto';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from '../ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PassengersService } from 'src/passengers/providers/passengers.service';
import { Travel } from 'src/travels/travel.entity';
import { Passenger } from 'src/passengers/passenger.entity';

@Injectable()
export class TicketReserveProvider {
  constructor(
    private passengerService: PassengersService,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private dataSource: DataSource,
  ) {}

  async ticketReserve(ticketReserveDto: TicketReserveDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { travelId, reservedSeat, phoneNumber, nationalCode } =
      ticketReserveDto;

    const travel = await queryRunner.manager.findOne(Travel, {
      where: { id: travelId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!travel) throw new NotFoundException('travel not found');

    if (travel.emptySeats <= 0)
      throw new BadRequestException("there's no seats to reserve");

    if (travel.totalSeats < reservedSeat)
      throw new BadRequestException(
        'the service does not have any seat with this number',
      );

    try {
      await this.validateReservedSeat(travelId, reservedSeat);

      const passenger = await this.validatePhoneNumAndNationalCode(
        travelId,
        phoneNumber,
        nationalCode,
      );

      let passengerId = passenger ? passenger.id : null;
      if (!passengerId) {
        const { identifiers } = await queryRunner.manager.insert(Passenger, {
          ...ticketReserveDto,
          birthDate: new Date(ticketReserveDto.birthDate),
        });

        passengerId = identifiers[0].id;
      }

      const ticketInstance = {
        travel: { id: ticketReserveDto.travelId },
        passenger: { id: passengerId },
        reservedSeat: ticketReserveDto.reservedSeat,
      };

      const resualt = await queryRunner.manager.insert(Ticket, ticketInstance);

      await queryRunner.manager.increment(
        Travel,
        { id: ticketReserveDto.travelId },
        'emptySeats',
        -1,
      );

      await queryRunner.commitTransaction();
      return resualt;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(String(err));
    } finally {
      await queryRunner.release();
    }
  }

  async validateReservedSeat(travelId: number, reservedSeat: number) {
    const ticket = await this.ticketRepository.findOne({
      where: {
        reservedSeat,
        travel: { id: travelId },
      },
      select: ['id', 'reservedSeat'],
    });

    if (ticket) throw new BadRequestException('this seat is allready reserved');
  }

  async validatePhoneNumAndNationalCode(
    travelId: number,
    phoneNumber: string,
    nationalCode: string,
  ) {
    // make sure this passenger did not buy a ticket from the service before
    const ticket = await this.ticketRepository.findOne({
      where: {
        passenger: { phoneNumber, nationalCode },
        travel: { id: travelId },
      },
      select: ['id', 'reservedSeat'],
    });

    if (ticket)
      throw new BadRequestException(
        'passenger allready reserved a seat from this service',
      );

    // get the user if it's allready exist
    return await this.passengerService.findByUniqueCode(
      phoneNumber,
      nationalCode,
    );
  }
}
