import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './services/drivers.service';
import { DriversController } from './controllers/drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DeliveryDriver } from '../typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryDriver]), forwardRef(() => AuthModule)],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule {}
