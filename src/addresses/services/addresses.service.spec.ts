import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address, Customer, CustomerAddress, Restaurant } from '../../typeorm';
import { AddressesService } from './addresses.service';

describe('AddressesService', () => {
  let service: AddressesService;

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]
  const addresses = [{ street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }]
  const customers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: new Date(), role: 'User' }]

  let mockAddressRepository = {
    create: jest.fn(dto => dto),
    save: jest.fn(dto => Promise.resolve({ id: Date.now(), ...dto }))
  }
  let mockRestaurantRepository = {
    findOne: jest.fn(query => null),
    save: jest.fn(dto => Promise.resolve({ id: Date.now(), address: dto, ...restaurants[0] }))

  }
  let mockCustomerRepository = {
    findOne: jest.fn(query => null),
  }
  let mockCustomerAddressRepository = {
    create: jest.fn((customer, address) => ({ customer, address })),
    save: jest.fn(dto => Promise.resolve({ id: Date.now(), customer: customers[0], address: addresses[0] }))
  }

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

  describe('createRestaurantAddress', () => {

    it('should throw NotFoundException', () => {
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }

      expect(async () => await service.createRestaurantAddress(1, dto)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })

    it('should create and return the address', async () => {
      mockRestaurantRepository.findOne.mockImplementation((query) => restaurants[0])
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }
      
      expect(await service.createRestaurantAddress(1, dto)).toEqual({
        id: expect.any(Number),
        ...restaurants[0],
        address: { id: expect.any(Number), ...dto }
      })
    })
  })

  describe('createCustomerAddress', () => {

    it('should throw NotFoundException', () => {
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }

      expect(async () => await service.createCustomerAddress(1, dto)).rejects.toEqual(new NotFoundException('No customer with this id'))
    })

    it('should create and return the address', async () => {
      mockCustomerRepository.findOne.mockImplementation((query) => restaurants[0])
      const dto = { street_number: 10, address_line1: 'somewhere str', city: 'nowhere', region: 'nowhere', postal_code: '123456' }

      expect(await service.createCustomerAddress(1, dto)).toEqual({
        id: expect.any(Number),
        customer: customers[0],
        address: addresses[0]
      })
    })
  })
});
