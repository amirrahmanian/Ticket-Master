import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import validationSchema from './config/validation.schema';
import { TicketsModule } from './tickets/tickets.module';
import { TravelsModule } from './travels/travels.module';
import { PassengersModule } from './passengers/passengers.module';
import { PaymentModule } from './payment/payment.module';
import { VerificationModule } from './verification/verification.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { AdminAuthenticationGuard } from './common/guards/admin-authentication.guard';
import { PassengerAuthenticationGuard } from './common/guards/passenger-authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './verification/config/verification.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get<string>('appConfig.database.name'),
        host: configService.get<string>('appConfig.database.host'),
        port: configService.get<number>('appConfig.database.port'),
        username: configService.get<string>('appConfig.database.username'),
        password: configService.get<string>('appConfig.database.password'),
        synchronize: configService.get<boolean>(
          'appConfig.database.synchronize',
        ),
        autoLoadEntities: configService.get<boolean>(
          'appConfig.database.autoLoadEntities',
        ),
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          ttl: 60 * 1000,
          socket: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
          },
        });

        return { store };
      },
      isGlobal: true,
    }),
    TicketsModule,
    TravelsModule,
    PassengersModule,
    PaymentModule,
    VerificationModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AdminAuthenticationGuard,
    PassengerAuthenticationGuard,
  ],
})
export class AppModule {}
