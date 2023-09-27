import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { AuthService } from '../../auth/auth.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  const mockRestaurantsService = {
    create: jest.fn((dto) => { 
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date() }
    })
  }

  const mockAuthService = {
    loginCustomer: jest.fn(dto => ({ access_token: 'some random string' }))
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
        date_joined: expect.any(Date)
      })

      expect(mockRestaurantsService.create).toHaveBeenCalled();
    })
  })
});
