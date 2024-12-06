import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompareCodeDto {
  @ApiProperty({
    description: 'Phone number in 11-digit format',
    example: '09025874101',
  })
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'phoneNumber is not valid',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '6-digit verification code',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: 'please enter 6 digit number',
  })
  code: string;
}
