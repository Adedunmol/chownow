import { Module, forwardRef } from '@nestjs/common';
import { AddressesService } from './services/addresses.service';
import { AddressesController } from './controllers/addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Customer, CustomerAddress, Restaurant } from '../typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address, CustomerAddress, Restaurant, Customer]), forwardRef(() => AuthModule)],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService]
})
export class AddressesModule {}
