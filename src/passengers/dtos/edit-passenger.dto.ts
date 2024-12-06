import {
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidTimestamp } from 'src/common/decorators/is-valid-timestamp.decorator';
import { Gender } from 'src/common/enums/common.enum';

export class EditPassengerDto {
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
