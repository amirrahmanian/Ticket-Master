import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Towns } from '../enums/travels.enum';

export class RetriveTravelsParamDto {
  @ApiProperty({
    description: 'Origin of the travel',
    enum: Towns,
    example: Towns.MASHHAD,
  })
  @IsNotEmpty()
  @IsEnum(Towns)
  origin: Towns;

  @ApiProperty({
    description: 'Destination of the travel',
    enum: Towns,
    example: Towns.TEHRAN,
  })
  @IsNotEmpty()
  @IsEnum(Towns)
  destination: Towns;
}
