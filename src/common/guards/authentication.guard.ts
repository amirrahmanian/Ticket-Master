import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from '../enums/auth-type.enum';
import { META_PARAM } from '../constants/auth.constant';
import { AdminAuthenticationGuard } from './admin-authentication.guard';
import { PassengerAuthenticationGuard } from './passenger-authentication.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private adminAuthenticationGuard: AdminAuthenticationGuard,
    private passengerAuthenticationGuard: PassengerAuthenticationGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const gotAuthType: AuthType = this.reflector.get(
        META_PARAM,
        context.getHandler(),
      );

      switch (gotAuthType) {
        case AuthType.ADMIN:
          return await this.adminAuthenticationGuard.canActivate(context);
        case AuthType.PASSENGER:
          return await this.passengerAuthenticationGuard.canActivate(context);
        case AuthType.NONE:
          return true;
        default:
          return false;
      }
    } catch (err) {
      throw new UnauthorizedException(String(err));
    }
  }
}
