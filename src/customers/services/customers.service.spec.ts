import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../../typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CustomersService', () => {
  let service: CustomersService;

  const customers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: new Date() }]

  const mockCustomersRepository = {
    create: jest.fn(dto => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date(), role: 'User' }) 
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
        role: 'User',
        date_joined: expect.any(Date)
      })

    })

    it('should throw conflict exception', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => true)

      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }

      expect(async () => await service.create(dto)).rejects.toEqual(new ConflictException('This username already exists'))

    })
  })

  describe('findCustomers', () => {

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

  describe('updateAdmin', () => {

    it('should update a customer (admin)', async () => {
      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      expect(await service.updateAdmin(123, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        role: 'User',
        date_joined: expect.any(Date)
      })
    })

    it('should throw NotFoundException', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => null)
      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      expect(async () => await service.updateAdmin(1, dto)).rejects.toEqual(new NotFoundException('No customer with this id'))

    })
  })

  describe('update', () => {

    it('should throw NotFoundException', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => null)
      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      expect(async () => await service.updateAdmin(1, dto)).rejects.toEqual(new NotFoundException('No customer with this id'))
    })

    it('should update a customer', async () => {
      mockCustomersRepository.findOne.mockImplementation((query) => customers[0])
      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      expect(await service.update(123, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        role: 'User',
        date_joined: expect.any(Date)
      })
    })

  })
});
