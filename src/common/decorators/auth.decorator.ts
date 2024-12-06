import { SetMetadata } from '@nestjs/common';
import { META_PARAM } from '../constants/auth.constant';
import { AuthType } from '../enums/auth-type.enum';

export const Auth = (arg: Partial<AuthType>) => SetMetadata(META_PARAM, arg);
