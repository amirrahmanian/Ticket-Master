import { Module } from '@nestjs/common';
import { VerificationService } from './providers/verification.service';
import { VerificationController } from './verification.controller';
import { ConfigModule } from '@nestjs/config';
import jwt from './config/verification.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokenProvider } from './providers/generate-token.provider';

@Module({
  imports: [
    ConfigModule.forFeature(jwt),
    JwtModule.registerAsync(jwt.asProvider()),
  ],
  providers: [VerificationService, GenerateTokenProvider],
  controllers: [VerificationController],
})
export class VerificationModule {}
