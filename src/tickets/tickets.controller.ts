import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { TicketReserveDto } from './dtos/ticket-reserve.dto';
import { TicketsService } from './providers/tickets.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post('reserve-ticket')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Reserve a ticket',
    description: 'Allows a user to reserve a ticket for a specific travel.',
  })
  @ApiBody({
    description: 'Ticket reservation details',
    type: TicketReserveDto,
  })
  ticketReserve(@Body() ticketReserveDto: TicketReserveDto) {
    return this.ticketsService.ticketReserve(ticketReserveDto);
  }

  @Delete('cancle-ticket/:id')
  @Auth(AuthType.PASSENGER)
  @ApiParam({
    name: 'id',
    description: 'ID of the ticket to delete',
    example: 123,
    type: Number,
  })
  ticketCancle(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.ticketsService.ticketCancle(id, user);
  }
}
