import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PassengersService } from './providers/passengers.service';
import { EditPassengerDto } from './dtos/edit-passenger.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('Passengers')
@Controller('passengers')
export class PassengersController {
  constructor(private passengersService: PassengersService) {}

  @Put(':id')
  @Auth(AuthType.PASSENGER)
  @ApiOperation({
    summary: 'Edit passenger details',
    description: 'Allows a passenger to update their personal details.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the passenger to edit',
    example: 123,
    type: Number,
  })
  @ApiBody({
    description: 'Details of the passenger to be updated',
    type: EditPassengerDto,
  })
  editPassenger(
    @Param('id', ParseIntPipe) id: number,
    @Body() editPassengerDto: EditPassengerDto,
    @User() user: any,
  ) {
    return this.passengersService.editPassenger(id, editPassengerDto, user);
  }
}
