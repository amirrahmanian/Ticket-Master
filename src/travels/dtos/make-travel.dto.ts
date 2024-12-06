import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyName, Level, ServiceTypes, Towns } from '../enums/travels.enum';
import { IsNotEqualTo } from '../decorators/is-not-equal.decorator';
import { IsValidTimestamp } from '../../common/decorators/is-valid-timestamp.decorator';

export class MakeTravelDto {
  @ApiProperty({
    description: 'Type of service for the travel',
    enum: ServiceTypes,
    example: ServiceTypes.BUS,
  })
  @IsNotEmpty()
  @IsEnum(ServiceTypes)
  serviceType: ServiceTypes;

  @ApiProperty({
    description: 'Name of the company providing the travel service',
    enum: CompanyName,
    example: CompanyName.MAHAN,
  })
  @IsNotEmpty()
  @IsEnum(CompanyName)
  companyName: CompanyName;

  @ApiProperty({
    description: 'Service level (e.g., Economy, Business)',
    enum: Level,
    example: Level.VIP2,
  })
  @IsNotEmpty()
  @IsEnum(Level)
  level: Level;

  @ApiProperty({
    description: 'Additional notes about the travel',
    example: 'Direct bus service with one stop for refreshment.',
    maxLength: 400,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  note: string;

  @ApiProperty({
    description: 'Total number of seats available in the vehicle',
    example: 50,
    maximum: 80,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(80)
  totalSeats: number;

  @ApiProperty({
    description: 'Number of empty seats available for booking',
    example: 50,
    maximum: 80,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(80)
  emptySeats: number;

  @ApiProperty({
    description: 'Timestamp of the travel date departure',
    example: 1733828386493,
  })
  @IsNotEmpty()
  @IsValidTimestamp()
  @IsPositive()
  date: number;

  @ApiProperty({
    description: 'Origin of the travel',
    enum: Towns,
    example: Towns.MASHHAD,
  })
  @IsNotEmpty()
  @IsEnum(Towns)
  origin: Towns;

  @ApiProperty({
    description: 'Destination of the travel (must differ from origin)',
    enum: Towns,
    example: Towns.TEHRAN,
  })
  @IsNotEmpty()
  @IsEnum(Towns)
  @IsNotEqualTo('origin')
  destination: Towns;

  @ApiProperty({
    description: 'Price of the travel ticket',
    example: 600000,
  })
  @IsNotEmpty()
  @IsInt()
  price: number;
}
