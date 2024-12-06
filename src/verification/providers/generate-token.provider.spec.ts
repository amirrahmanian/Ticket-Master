import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenProvider } from './generate-token.provider';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/verification.config';
import { Roles } from 'src/common/enums/roles.enum';

describe('GenerateTokenProvider', () => {
  let provider: GenerateTokenProvider;
  let jwtServiceMock: any;

  beforeEach(async () => {
    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateTokenProvider,
        {
          provide: jwtConfig.KEY,
          useValue: { secret: 'secret', acsessTokenTTL: '1h' },
        },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    provider = module.get<GenerateTokenProvider>(GenerateTokenProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('signToken', () => {
    it('should sign a token with correct payload', async () => {
      jwtServiceMock.signAsync.mockResolvedValue('test-token');
      const result = await provider.signToken('1234567890', Roles.PASSENGER);

      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
      expect(result).toBe('test-token');
    });
  });

  describe('signAdminIn', () => {
    it('should authenticate admin and return token', async () => {
      jwtServiceMock.signAsync.mockResolvedValue('admin-token');
      const result = await provider.signAdminIn({
        username: 'admin',
        password: 'password',
      });

      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
      expect(result).toBe('admin-token');
    });
  });
});
