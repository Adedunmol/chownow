import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from '../services/addresses.service';

describe('AddressesController', () => {
  let controller: AddressesController;
 
  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]
  const addresses = [{ street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }]
  const customers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: new Date(), role: 'User' }]

  let mockAddressesServices = {
    createRestaurantAddress: jest.fn((id, dto) => Promise.resolve({ id: Date.now(), address: dto, ...restaurants[0] })),
    createCustomerAddress: jest.fn((id, dto) => Promise.resolve({ id: Date.now(), address: dto, customer: customers[0] }))
  }

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

  describe('createRestaurantAddress', () => {

    it('should create an address', async () => {
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }
      const req = { user: restaurants[0] }
    
      expect(await controller.createRestaurantAddress(req, dto)).toEqual({
        id: expect.any(Number),
        address: dto,
        ...restaurants[0]
      })
    })
  })

  describe('createCustomerAddress', () => {

    it('should create an address', async () => {
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }
      const req = { user: customers[0] }
    
      expect(await controller.createCustomerAddress(req, dto)).toEqual({
        id: expect.any(Number),
        address: dto,
        customer: customers[0]
      })
    })
  })
});
