import { IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidTimestamp } from '../../common/decorators/is-valid-timestamp.decorator';

export class RetriveTravelsQueryDto {
  @ApiProperty({
    description:
      'Start of the travel period (timestamp in seconds since Unix epoch)',
    example: 1732964304090,
    name: 'from',
  })
  @IsNotEmpty()
  @IsValidTimestamp()
  from: number;

  @ApiProperty({
    description:
      'End of the travel period (timestamp in seconds since Unix epoch)',
    example: 1733828386493,
    name: 'to',
  })
  @IsNotEmpty()
  @IsValidTimestamp()
  @IsPositive()
  to: number;
}
