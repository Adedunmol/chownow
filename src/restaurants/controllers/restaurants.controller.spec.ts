import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { AuthService } from '../../auth/auth.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  const restaurant = {
    restaurant_name: 'test',
    password: 'password'
  }

  const mockRestaurantsService = {
    create: jest.fn((dto) => { 
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date(), role: 'Restaurant' }
    })
  }

  const mockAuthService = {
    loginRestaurant: jest.fn(dto => ({ access_token: 'some random string' }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [RestaurantsService, AuthService],
    })
    .overrideProvider(RestaurantsService)
    .useValue(mockRestaurantsService)
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerRestaurant', () => {

    it('should create a restaurant', async () => {
      const dto = { restaurant_name: 'test', password: 'password' };

      expect(controller.registerRestaurant(dto)).toEqual({
        id: expect.any(Number),
        restaurant_name: dto.restaurant_name,
        role: 'Restaurant',
        date_joined: expect.any(Date)
      })

      expect(mockRestaurantsService.create).toHaveBeenCalled();
    })
  })

  describe('loginRestaurant', () => {
    
    it('should login restaurant', () => {
      const req = {
        user: restaurant
      }

      expect(controller.loginRestaurant(req)).toEqual({
       access_token: expect.any(String) 
      })

      expect(mockAuthService.loginRestaurant).toHaveBeenCalled()
    })
  })
});
