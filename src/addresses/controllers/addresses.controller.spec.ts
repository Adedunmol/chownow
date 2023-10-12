import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from '../services/addresses.service';

describe('AddressesController', () => {
  let controller: AddressesController;

  let mockAddressesServices = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [AddressesService],
    })
    .overrideProvider(AddressesService)
    .useValue(mockAddressesServices)
    .compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
