import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customers/services/customers.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as passwordModule from '../utils/bcrypt';
import { RestaurantsService } from '../restaurants/services/restaurants.service';
import { DriversService } from '../drivers/services/drivers.service';

describe('AuthService', () => {
  let service: AuthService;

  const customer = {
    id: Date.now(),
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    date_joined: new Date()
  }

  const driver = {
    id: Date.now(),
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    date_joined: new Date()
  }

  const restaurant = {
    id: Date.now(),
    restaurant_name: 'test',
    password: 'password',
    date_joined: new Date()
  }

  const mockCustomersService = {
    findByUsername: jest.fn((dto) => Promise.resolve(customer))
  }

  const mockDriversService = {
    findByUsername: jest.fn((dto) => Promise.resolve(driver))
  }

  const mockJwtService = {
    sign: jest.fn(payload => 'some random string')
  }

  const mockRestaurantsService = {
    findByName: jest.fn((dto) => Promise.resolve(restaurant))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CustomersService, JwtService, RestaurantsService, DriversService],
    })
    .overrideProvider(CustomersService)
    .useValue(mockCustomersService)
    .overrideProvider(JwtService)
    .useValue(mockJwtService)
    .overrideProvider(RestaurantsService)
    .useValue(mockRestaurantsService)
    .overrideProvider(DriversService)
    .useValue(mockDriversService)
    .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCustomer', () => {

    it('should validate and return null', async () => {
      const spy = jest.spyOn(passwordModule, 'comparePassword');
      spy.mockReturnValue(false)

      expect(await service.validateCustomer('test', 'password')).toEqual(null);
    })

    it('should validate and return customer', async () => {
      const spy = jest.spyOn(passwordModule, 'comparePassword');
      spy.mockReturnValue(true)

      expect(await service.validateCustomer('test', 'password')).toEqual(customer);
    })
  })

  describe('loginCustomer', () => {

    it('should return access token', async () => {

      expect(await service.loginCustomer(customer)).toEqual({ access_token: expect.any(String) })
    })
  })

  describe('loginRestaurant', () => {

    it('should return access token', async () => {

      expect(await service.loginRestaurant(restaurant)).toEqual({ access_token: expect.any(String) })
    })
  })

  describe('loginDriver', () => {

    it('should return access token', async () => {

      expect(await service.loginDriver(driver)).toEqual({ access_token: expect.any(String) })
    })
  })
});
