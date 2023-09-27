import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from './drivers.controller';
import { DriversService } from '../services/drivers.service';
import { AuthService } from '../../auth/auth.service';

describe('DriversController', () => {
  let controller: DriversController;

  const driver = {
    id: Date.now(),
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    date_joined: new Date()
  }

  const mockDriversService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date() }
    })
  }

  const mockAuthService = {
    loginDriver: jest.fn(dto => ({ access_token: 'some random string' }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService, AuthService],
    })
    .overrideProvider(DriversService)
    .useValue(mockDriversService)
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    controller = module.get<DriversController>(DriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerDriver', () => {
    
    it('should create a customer', () => {
      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
      const { password, ...others } = dto

      expect(controller.registerDriver(dto)).toEqual({
        id: expect.any(Number),
        ...others,
        date_joined: expect.any(Date)
      })

      expect(mockDriversService.create).toHaveBeenCalled()
    })
  })

  describe('loginDriver', () => {
    
    it('should login driver', () => {
      const req = {
        user: driver
      }

      expect(controller.loginDriver(req)).toEqual({
       access_token: expect.any(String) 
      })

      expect(mockAuthService.loginDriver).toHaveBeenCalled()
    })
  })
});
