import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentQueryDto {
  @IsNotEmpty()
  @IsString()
  trackId: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  success: string;
}
