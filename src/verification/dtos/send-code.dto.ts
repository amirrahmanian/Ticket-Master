import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
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
}
