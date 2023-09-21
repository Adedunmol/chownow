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
    password: 'password',
    last_name: 'user',
    date_joined: new Date()
  }

  const mockCustomersService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date() }
    })
  }

  const mockAuthService = {
    login: jest.fn(dto => ({ access_token: 'some random string' }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule],
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

      expect(mockAuthService.login).toHaveBeenCalled()
    })
  })
});
