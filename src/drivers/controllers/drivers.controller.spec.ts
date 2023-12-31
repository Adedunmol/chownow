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
    role: 'Driver',
    date_joined: new Date()
  }

  const drivers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: Date.now() }]

  const mockDriversService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date(), role: 'Driver' }
    }),
    findDrivers: jest.fn(() => drivers),
    findById: jest.fn(id => driver),
    updateAdmin: jest.fn((id, dto) => driver),
    update: jest.fn((id, dto) => driver),
    remove: jest.fn(id => driver)
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
        role: 'Driver',
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

  describe('getDrivers', () => {

    it('should return drivers', async () => {

      expect(await controller.getDrivers()).toEqual(drivers)
    })
  })

  describe('findOne', () => {

    it('should return a driver', async () => {

      expect(await controller.findOne(1)).toEqual(driver)
    })
  })

  
  describe('updateAdmin', () => {

    it('should return updated driver (Admin)', async () => {
      const { role, ...others } = driver;

      expect(await controller.updateAdmin(1, others)).toEqual(driver)
    })
  })

  describe('update', () => {

    it('should return updated driver', async () => {
      const { role, ...others } = driver;
      const req = {
        user: driver
      }

      expect(await controller.update(req, others)).toEqual(driver)
    })
  })

  describe('removeAdmin', () => {

    it('should remove and return driver', async () => {

      expect(await controller.removeAdmin(1)).toEqual(driver)
    })
  })

  describe('remove', () => {

    it('should remove and return driver', async () => {
      const req = {
        user: driver
      }

      expect(await controller.remove(req)).toEqual(driver)
    })
  })
});
