import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../enums/roles.enum';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

@Injectable()
export class PassengerAuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private jwtConfig: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const acsessToken = this.extractToken(req);
    if (!acsessToken)
      throw new UnauthorizedException("the user's token is not valid");

    try {
      const payload = await this.jwtService.verifyAsync(acsessToken, {
        secret: this.jwtConfig.get('jwt.secret'),
        issuer: this.jwtConfig.get('jwt.issuer'),
        audience: this.jwtConfig.get('jwt.audience'),
      });

      if (payload.role !== Roles.PASSENGER) throw new Error('access denied');

      req[REQUEST_USER_KEY] = payload;
    } catch (err) {
      throw new UnauthorizedException(err?.message);
    }

    return true;
  }

  extractToken(request: any): string | undefined {
    const acsessToken = request.headers.authorization?.split(' ')[1];
    return acsessToken;
  }
}
