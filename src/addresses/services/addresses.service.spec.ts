import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address, Customer, CustomerAddress, Restaurant } from '../../typeorm';
import { AddressesService } from './addresses.service';

describe('AddressesService', () => {
  let service: AddressesService;

  let mockAddressRepository = {}
  let mockRestaurantRepository = {}
  let mockCustomerRepository = {}
  let mockCustomerAddressRepository = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressesService, 
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepository
        },
        {
          provide: getRepositoryToken(CustomerAddress),
          useValue: mockCustomerAddressRepository
        },
        {
          provide: getRepositoryToken(Restaurant),
          useValue: mockRestaurantRepository
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository
        }
      ],
    })
    .compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
