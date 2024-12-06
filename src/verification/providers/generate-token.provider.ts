import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwt from '../config/verification.config';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/common/enums/roles.enum';
import { SignAdminInDto } from '../dtos/sign-admin-in.dto';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    @Inject(jwt.KEY)
    private jwtConfiguration: ConfigType<typeof jwt>,
    private jwtService: JwtService,
  ) {}

  async signToken(phoneNumber: string, role: Roles) {
    return await this.jwtService.signAsync(
      { phoneNumber, role },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.acsessTokenTTL,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
  }

  async signAdminIn(signAdminInDto: SignAdminInDto) {
    try {
      const { username, password } = signAdminInDto;
      const admin = this.jwtConfiguration.admin;

      if (admin.username !== username || admin.password !== password)
        throw new Error('username or password is wrong');

      const accessToken = await this.jwtService.signAsync(
        { username, role: Roles.ADMIN },
        {
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.acsessTokenTTL,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      return { accessToken };
    } catch (err) {
      throw new BadRequestException(String(err));
    }
  }
}
