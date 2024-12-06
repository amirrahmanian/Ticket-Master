import { Test, TestingModule } from '@nestjs/testing';
import { TravelsController } from './travels.controller';
import { TravelsService } from './providers/travels.service';
import { MakeTravelDto } from './dtos/make-travel.dto';
import { RetriveTravelsParamDto } from './dtos/retrive-travels-param.dto';
import { RetriveTravelsQueryDto } from './dtos/retrive-travels-query.dto';
import { Travel } from './travel.entity';
import { CompanyName, Level, ServiceTypes, Towns } from './enums/travels.enum';

describe('TravelsController', () => {
  let controller: TravelsController;
  let service: TravelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelsController],
      providers: [
        {
          provide: TravelsService,
          useValue: {
            getTravelById: jest.fn(),
            retriveTravels: jest.fn(),
            retriveAllTravels: jest.fn(),
            addTravel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TravelsController>(TravelsController);
    service = module.get<TravelsService>(TravelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'getTravelById').mockResolvedValue(travel);

      const result = await controller.getTravelById(1);
      expect(service.getTravelById).toHaveBeenCalledWith(1);
      expect(result).toEqual(travel);
    });
  });

  describe('retriveTravels', () => {
    it('should retrieve travels by origin, destination, and date range', async () => {
      const params: RetriveTravelsParamDto = {
        origin: Towns.MASHHAD,
        destination: Towns.TEHRAN,
      };
      const query: RetriveTravelsQueryDto = {
        from: Date.now(),
        to: Date.now(),
      };
      const travels: Travel[] = [];

      jest.spyOn(service, 'retriveTravels').mockResolvedValue(travels);
      const result = await controller.retriveTravels(params, query);

      expect(service.retriveTravels).toHaveBeenCalledWith(params, query);
      expect(result).toEqual(travels);
    });
  });

  describe('retriveAllTravels', () => {
    it('should return all cached travels', async () => {
      const travels: Travel[] = [];
      jest.spyOn(service, 'retriveAllTravels').mockResolvedValue(travels);

      const result = await controller.retriveAllTravels();
      expect(service.retriveAllTravels).toHaveBeenCalled();
      expect(result).toEqual(travels);
    });
  });

  describe('addTravel', () => {
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
      jest
        .spyOn(service, 'addTravel')
        .mockResolvedValue({ generatedMaps: [], identifiers: [], raw: {} });

      const result = await controller.addTravel(dto);
      expect(service.addTravel).toHaveBeenCalledWith(dto);
      expect(result).toEqual({});
    });
  });
});
