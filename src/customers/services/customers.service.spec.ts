import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../../typeorm';
import { ConflictException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;

  const customers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: Date.now() }]

  const mockCustomersRepository = {
    create: jest.fn(dto => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date() }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(() => customers),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, {
        provide: getRepositoryToken(Customer),
        useValue: mockCustomersRepository
      }],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('should create a new customer record', async () => {

      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
      const { password, ...others } = dto

      expect(await service.create(dto)).toEqual({
        id: expect.any(Number),
        ...others,
        date_joined: expect.any(Date)
      })

    })

    it('should throw conflict exception', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => true)

      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }

      expect(async () => await service.create(dto)).rejects.toEqual(new ConflictException('This username already exists'))

    })
  })

  describe('getCustomers', () => {

    it('should get all customers', async () => {

      expect(await service.findCustomers()).toEqual(customers)
    })
  })

  describe('findByUsername', () => {

    it('should get a customer', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => customers[0])

      expect(await service.findByUsername('test1')).toEqual(customers[0])
    })

    it('should return null', async () => {

      expect(await service.findByUsername('test1')).toEqual(customers[0])
    })
  })

  describe('findById', () => {

    it('should get a customer', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => customers[0])

      expect(await service.findById(1)).toEqual(customers[0])
    })

    it('should return null', async () => {

      expect(await service.findById(1)).toEqual(customers[0])
    })
  })
});
