import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidTimestamp } from 'src/common/decorators/is-valid-timestamp.decorator';
import { Gender } from 'src/common/enums/common.enum';

export class TicketReserveDto {
  @ApiProperty({
    description: 'ID of the travel',
    example: 123,
  })
  @IsNotEmpty()
  @IsPositive()
  travelId: number;

  @ApiProperty({
    description: 'Number of reserved seats',
    example: 2,
    maximum: 80,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(80)
  reservedSeat: number;

  @ApiProperty({
    description: 'Username of the passenger',
    example: 'JohnDoe',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  username: string;

  @ApiProperty({
    description: 'Family name of the passenger',
    example: 'Smith',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  family: string;

  @ApiProperty({
    description: 'National code of the passenger (10 digits)',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  @Matches(/^\d{10}$/, {
    message: 'nationalCode should be valid like 0902587410',
  })
  nationalCode: string;

  @ApiProperty({
    description: 'Phone number of the passenger (11 digits)',
    example: '09025874101',
  })
  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'phoneNumber should be like this 09025874101',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Birth date as a Unix timestamp (in seconds)',
    example: 915148800, // "1999-01-01 00:00:00 UTC"
  })
  @IsNotEmpty()
  @IsPositive()
  @IsValidTimestamp()
  birthDate: number;

  @ApiProperty({
    description: 'Gender of the passenger',
    enum: Gender,
    example: Gender.MAIL,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
