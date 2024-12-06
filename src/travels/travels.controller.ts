import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TravelsService } from './providers/travels.service';
import { RetriveTravelsParamDto } from './dtos/retrive-travels-param.dto';
import { RetriveTravelsQueryDto } from './dtos/retrive-travels-query.dto';
import { MakeTravelDto } from './dtos/make-travel.dto';
import { Travel } from './travel.entity';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('travels')
export class TravelsController {
  constructor(private travelsService: TravelsService) {}

  @Get('show-travel/:id')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Retrieve travel by ID',
    description: 'Fetch a specific travel using its ID.',
  })
  @ApiParam({ name: 'id', description: 'ID of the travel', type: Number })
  getTravelById(@Param('id', ParseIntPipe) id: number): Promise<Travel> {
    return this.travelsService.getTravelById(id);
  }

  @Get(':origin-:destination')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Retrieve travels by origin and destination',
    description: 'Fetch travel options between two locations.',
  })
  retriveTravels(
    @Param() retriveTravelsParamDto: RetriveTravelsParamDto,
    @Query() retriveTravelsQueryDto: RetriveTravelsQueryDto,
  ) {
    return this.travelsService.retriveTravels(
      retriveTravelsParamDto,
      retriveTravelsQueryDto,
    );
  }

  @Get('all')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Retrieve travels',
    description: 'Fetch travels from cache.',
  })
  retriveAllTravels() {
    return this.travelsService.retriveAllTravels();
  }

  @Post()
  @Auth(AuthType.ADMIN)
  @ApiOperation({
    summary: 'Add a new travel',
    description: 'Create a new travel entry in the system.',
  })
  @ApiBody({
    description: 'Details of the travel to create',
    type: MakeTravelDto,
  })
  async addTravel(@Body() makeTravelDto: MakeTravelDto) {
    return this.travelsService.addTravel(makeTravelDto);
  }
}
