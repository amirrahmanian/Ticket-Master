import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from '../travel.entity';
import { Between, Repository } from 'typeorm';
import { RetriveTravelsParamDto } from '../dtos/retrive-travels-param.dto';
import { RetriveTravelsQueryDto } from '../dtos/retrive-travels-query.dto';
import { MakeTravelDto } from '../dtos/make-travel.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TravelsService {
  constructor(
    @InjectRepository(Travel) private travelRepository: Repository<Travel>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getTravelById(id: number): Promise<Travel> {
    const travel = await this.travelRepository.findOneBy({ id });
    if (!travel) throw new NotFoundException('travel id is wrong');

    return travel;
  }

  async retriveTravels(
    retriveTravelsParamDto: RetriveTravelsParamDto,
    retriveTravelsQueryDto: RetriveTravelsQueryDto,
  ) {
    try {
      const { origin, destination } = retriveTravelsParamDto;
      const { from, to } = retriveTravelsQueryDto;

      return await this.travelRepository.findBy({
        origin,
        destination,
        date: Between(new Date(from), new Date(to)),
      });
    } catch (err) {
      throw new BadRequestException(String(err));
    }
  }

  async retriveAllTravels(): Promise<Travel[]> {
    try {
      const cachedData = await this.cacheManager.get<Travel[]>('all-travels');
      if (cachedData) return cachedData;

      const data = await this.travelRepository.find();
      await this.cacheManager.set('all-travels', data);

      return data;
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  async addTravel(makeTravelDto: MakeTravelDto) {
    if (makeTravelDto.emptySeats > makeTravelDto.totalSeats)
      throw new BadRequestException(
        'the empty seats must be less than or equal totlaSeats',
      );

    if (makeTravelDto.date < Date.now())
      throw new BadRequestException('date is expired');

    try {
      return await this.travelRepository.insert({
        ...makeTravelDto,
        date: new Date(makeTravelDto.date),
      });
    } catch (err) {
      throw new RequestTimeoutException(String(err));
    }
  }
}
