import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from '../services/customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;

  const mockCustomersService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date() }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService],
    }).overrideProvider(CustomersService).useValue(mockCustomersService).compile();

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
});
