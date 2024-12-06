import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { VerificationService } from './providers/verification.service';
import { CompareCodeDto } from './dtos/compare-code.dto';
import { SendCodeDto } from './dtos/send-code.dto';
import { SignAdminInDto } from './dtos/sign-admin-in.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post('OTP')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Send OTP code',
    description: 'Sending an OTP to a specified phone number.',
  })
  @ApiBody({
    type: SendCodeDto,
    description: 'Phone number to send the OTP to.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @HttpCode(200)
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.verificationService.sendCode(sendCodeDto.phoneNumber);
  }

  @Post('notification')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'Verify an OTP code against the phone number provided.',
  })
  @ApiBody({
    type: CompareCodeDto,
    description: 'Phone number and OTP code for verification.',
  })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @HttpCode(200)
  compareCode(@Body() compareCodeDto: CompareCodeDto) {
    return this.verificationService.compareCode(compareCodeDto);
  }

  @Post('sign-admin-in')
  @Auth(AuthType.NONE)
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate an admin using a username and password.',
  })
  @ApiBody({
    type: SignAdminInDto,
    description: 'Admin credentials for authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin logged in successfully',
    schema: { example: { accessToken: '...' } },
  })
  @HttpCode(200)
  signAdminIn(@Body() signAdminInDto: SignAdminInDto) {
    return this.verificationService.signAdminIn(signAdminInDto);
  }
}
