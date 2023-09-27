import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './services/drivers.service';
import { DriversController } from './controllers/drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), forwardRef(() => AuthModule)],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService]
})
export class DriversModule {}
