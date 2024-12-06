import { Test, TestingModule } from '@nestjs/testing';
import { TravelsService } from './travels.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Travel } from '../travel.entity';
import { Repository } from 'typeorm';
import { RetriveTravelsParamDto } from '../dtos/retrive-travels-param.dto';
import { RetriveTravelsQueryDto } from '../dtos/retrive-travels-query.dto';
import { MakeTravelDto } from '../dtos/make-travel.dto';
import { CompanyName, Level, ServiceTypes, Towns } from '../enums/travels.enum';

describe('TravelsService', () => {
  let service: TravelsService;
  let repository: Repository<Travel>;
  let cacheManagerMock: any;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
        {
          provide: getRepositoryToken(Travel),
          useValue: {
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            find: jest.fn(),
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TravelsService>(TravelsService);
    repository = module.get<Repository<Travel>>(getRepositoryToken(Travel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTravelById', () => {
    it('should return a travel by ID', async () => {
      const travel: Travel | any = {
        deletedAt: null,
        id: 14,
        serviceType: ServiceTypes.BUS,
        companyName: CompanyName.MAHAN,
        level: Level.VIP2,
        note: 'this is the test note',
        totalSeats: 20,
        emptySeats: 19,
        date: new Date(),
        origin: Towns.MASHHAD,
        destination: Towns.TEHRAN,
        price: 400000,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(travel);

      const result = await service.getTravelById(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(travel);
    });

    it('should throw NotFoundException if travel not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(service.getTravelById(1)).rejects.toThrow(
        'travel id is wrong',
      );
    });
  });

  describe('retriveTravels', () => {
    it('should retrieve travels based on parameters', async () => {
      const params: RetriveTravelsParamDto = {
        origin: Towns.MASHHAD,
        destination: Towns.TEHRAN,
      };
      const query: RetriveTravelsQueryDto = {
        from: Date.now(),
        to: Date.now(),
      };

      jest.spyOn(repository, 'findBy').mockResolvedValue([]);

      const result = await service.retriveTravels(params, query);
      expect(repository.findBy).toHaveBeenCalledWith({
        origin: params.origin,
        destination: params.destination,
        date: expect.any(Object), // Between dates
      });
      expect(result).toEqual([]);
    });
  });

  describe('retriveAllTravels', () => {
    it('should return cached travels if available', async () => {
      const travels: Travel[] = [];
      cacheManagerMock.get.mockResolvedValue(travels);

      const result = await service.retriveAllTravels();
      expect(cacheManagerMock.get).toHaveBeenCalledWith('all-travels');
      expect(result).toEqual(travels);
    });

    it('should cache and return travels if not cached', async () => {
      const travels: Travel[] = [];
      jest.spyOn(repository, 'find').mockResolvedValue(travels);
      cacheManagerMock.get.mockResolvedValue(null);
      cacheManagerMock.set.mockResolvedValue(undefined);

      const result = await service.retriveAllTravels();
      expect(repository.find).toHaveBeenCalled();
      expect(cacheManagerMock.set).toHaveBeenCalledWith('all-travels', travels);
      expect(result).toEqual(travels);
    });
  });

  describe('addTravel', () => {
    it('should throw error if emptySeats > totalSeats', async () => {
      const dto: MakeTravelDto = {
        origin: Towns.MASHHAD,
        destination: Towns.TEHRAN,
        date: Date.now() + 1000,
        emptySeats: 10,
        totalSeats: 20,
        companyName: CompanyName.MAHAN,
        level: Level.VIP2,
        note: 'test note',
        price: 600000,
        serviceType: ServiceTypes.BUS,
      };
      await expect(service.addTravel(dto)).rejects.toThrow(
        'the empty seats must be less than or equal totlaSeats',
      );
    });

    it('should add a new travel', async () => {
      const dto: MakeTravelDto = {
        origin: Towns.MASHHAD,
        destination: Towns.TEHRAN,
        date: Date.now() + 1000,
        emptySeats: 10,
        totalSeats: 20,
        companyName: CompanyName.MAHAN,
        level: Level.VIP2,
        note: 'test note',
        price: 600000,
        serviceType: ServiceTypes.BUS,
      };
      jest.spyOn(repository, 'insert').mockResolvedValue({} as any);

      const result = await service.addTravel(dto);
      expect(repository.insert).toHaveBeenCalledWith({
        ...dto,
        date: expect.any(Date),
      });
      expect(result).toEqual({});
    });
  });
});
