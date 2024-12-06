import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GenerateTokenProvider } from './generate-token.provider';

describe('VerificationService', () => {
  let service: VerificationService;
  let cacheManagerMock: any;
  let tokenProviderMock: any;

  beforeEach(async () => {
    cacheManagerMock = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    tokenProviderMock = {
      signToken: jest.fn(),
      signAdminIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: GenerateTokenProvider, useValue: tokenProviderMock },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendCode', () => {
    it('should generate and store OTP code', async () => {
      jest.spyOn(cacheManagerMock, 'set').mockResolvedValue(undefined);

      const result = await service.sendCode('1234567890');
      expect(cacheManagerMock.set).toHaveBeenCalled();
      expect(result).toBe('OTP sent successfully');
    });
  });

  describe('compareCode', () => {
    it('should validate OTP and return token', async () => {
      cacheManagerMock.get.mockResolvedValue('123456');
      jest
        .spyOn(tokenProviderMock, 'signToken')
        .mockResolvedValue('test-token');

      const result = await service.compareCode({
        phoneNumber: '1234567890',
        code: '123456',
      });
      expect(cacheManagerMock.del).toHaveBeenCalledWith('1234567890');
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should throw error if OTP does not match', async () => {
      cacheManagerMock.get.mockResolvedValue('654321');
      await expect(
        service.compareCode({ phoneNumber: '1234567890', code: '123456' }),
      ).rejects.toThrow('not match');
    });
  });

  describe('signAdminIn', () => {
    it('should authenticate admin credentials', async () => {
      tokenProviderMock.signAdminIn.mockResolvedValue({
        accessToken: 'admin-token',
      });

      const result = await service.signAdminIn({
        username: 'admin',
        password: 'password',
      });
      expect(tokenProviderMock.signAdminIn).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'admin-token' });
    });
  });
});
