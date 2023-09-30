import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from '../services/customers.service';
import { AuthService } from '../../auth/auth.service';

describe('CustomersController', () => {
  let controller: CustomersController;

  const customer = {
    id: Date.now(),
    username: 'test',
    first_name: 'test',
    // password: 'password',
    last_name: 'user',
    role: 'User',
    date_joined: new Date()
  }

  const customers = [customer];

  const mockCustomersService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date(), role: 'User' }
    }),
    findCustomers: jest.fn(() => customers),
    findById: jest.fn(id => customer),
    updateAdmin: jest.fn((id, dto) => customer),
    update: jest.fn((id, dto) => customer),
    remove: jest.fn(id => customer)
  }

  const mockAuthService = {
    loginCustomer: jest.fn(dto => ({ access_token: 'some random string' }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService, AuthService],
    }).overrideProvider(CustomersService).useValue(mockCustomersService).overrideProvider(AuthService).useValue(mockAuthService).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerCustomer', () => {
    
    it('should create a customer', () => {
      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
      const { password, ...others } = dto

      expect(controller.registerCustomer(dto)).toEqual({
        id: expect.any(Number),
        ...others,
        role: 'User',
        date_joined: expect.any(Date)
      })

      expect(mockCustomersService.create).toHaveBeenCalled()
    })
  })

  describe('loginCustomer', () => {
    
    it('should login customer', () => {
      const req = {
        user: customer
      }

      expect(controller.loginCustomer(req)).toEqual({
       access_token: expect.any(String) 
      })

      expect(mockAuthService.loginCustomer).toHaveBeenCalled()
    })
  })

  describe('getCustomers', () => {

    it('should return customers', async () => {

      expect(await controller.getCustomers()).toEqual(customers)
    })
  })

  describe('findOne', () => {

    it('should return a customer', async () => {

      expect(await controller.findOne(1)).toEqual(customer)
    })
  })

  describe('updateAdmin', () => {

    it('should return updated customer (Admin)', async () => {
      const { role, ...others } = customer;

      expect(await controller.updateAdmin(1, others)).toEqual(customer)
    })
  })

  describe('update', () => {

    it('should return updated customer', async () => {
      const { role, ...others } = customer;
      const req = {
        user: customer
      }

      expect(await controller.update(req, others)).toEqual(customer)
    })
  })

  describe('removeAdmin', () => {

    it('should remove and return customer', async () => {

      expect(await controller.removeAdmin(1)).toEqual(customer)
    })
  })

  describe('remove', () => {

    it('should remove and return customer', async () => {
      const req = {
        user: customer
      }

      expect(await controller.remove(req)).toEqual(customer)
    })
  })
});
