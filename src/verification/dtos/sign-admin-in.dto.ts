import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignAdminInDto {
  @ApiProperty({
    description: 'Admin username',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    description: 'Admin password',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
