import { Module } from '@nestjs/common';
import { AddressesService } from './services/addresses.service';
import { AddressesController } from './controllers/addresses.controller';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
