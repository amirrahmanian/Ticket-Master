import { Test, TestingModule } from '@nestjs/testing';
import { VerificationController } from './verification.controller';
import { VerificationService } from './providers/verification.service';
import { SendCodeDto } from './dtos/send-code.dto';
import { CompareCodeDto } from './dtos/compare-code.dto';
import { SignAdminInDto } from './dtos/sign-admin-in.dto';

describe('VerificationController', () => {
  let controller: VerificationController;
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationController],
      providers: [
        {
          provide: VerificationService,
          useValue: {
            sendCode: jest.fn(),
            compareCode: jest.fn(),
            signAdminIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VerificationController>(VerificationController);
    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendCode', () => {
    it('should call service with the correct phone number', async () => {
      const dto: SendCodeDto = { phoneNumber: '1234567890' };
      jest
        .spyOn(service, 'sendCode')
        .mockResolvedValue('OTP sent successfully');

      const result = await controller.sendCode(dto);
      expect(service.sendCode).toHaveBeenCalledWith(dto.phoneNumber);
      expect(result).toBe('OTP sent successfully');
    });
  });

  describe('compareCode', () => {
    it('should verify OTP successfully', async () => {
      const dto: CompareCodeDto = { phoneNumber: '1234567890', code: '123456' };
      jest
        .spyOn(service, 'compareCode')
        .mockResolvedValue({ accessToken: 'test-token' });

      const result = await controller.compareCode(dto);
      expect(service.compareCode).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'test-token' });
    });
  });

  describe('signAdminIn', () => {
    it('should authenticate admin successfully', async () => {
      const dto: SignAdminInDto = { username: 'admin', password: 'password' };
      jest
        .spyOn(service, 'signAdminIn')
        .mockResolvedValue({ accessToken: 'admin-token' });

      const result = await controller.signAdminIn(dto);
      expect(service.signAdminIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'admin-token' });
    });
  });
});
