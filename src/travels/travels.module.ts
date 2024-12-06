import { Module } from '@nestjs/common';
import { TravelsController } from './travels.controller';
import { TravelsService } from './providers/travels.service';
import { Travel } from './travel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Travel])],
  controllers: [TravelsController],
  providers: [TravelsService],
  exports: [TravelsService],
})
export class TravelsModule {}
