import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CompareCodeDto } from '../dtos/compare-code.dto';
import { GenerateTokenProvider } from './generate-token.provider';
import { Roles } from 'src/common/enums/roles.enum';
import { SignAdminInDto } from '../dtos/sign-admin-in.dto';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private generateTokenProvider: GenerateTokenProvider,
  ) {}

  async sendCode(phoneNumber: string) {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`Verification code for ${phoneNumber}: ${code}`);
      this.logger.log(`Verification code for ${phoneNumber}: ${code}`);

      await this.cacheManager.set(phoneNumber, code);

      return 'OTP sent successfully';
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  async compareCode(compareCodeDto: CompareCodeDto) {
    try {
      const { phoneNumber, code } = compareCodeDto;
      const realCode = await this.cacheManager.get<string>(phoneNumber);

      if (realCode !== code) throw new Error('not match');
      await this.cacheManager.del(phoneNumber);

      const accessToken = await this.generateTokenProvider.signToken(
        compareCodeDto.phoneNumber,
        Roles.PASSENGER,
      );

      return { accessToken };
    } catch (err) {
      throw new BadRequestException(String(err));
    }
  }

  async signAdminIn(signAdminInDto: SignAdminInDto) {
    return await this.generateTokenProvider.signAdminIn(signAdminInDto);
  }
}
