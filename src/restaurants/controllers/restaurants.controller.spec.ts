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

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]


  const mockRestaurantsService = {
    create: jest.fn((dto) => { 
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date(), role: 'Restaurant' }
    }),
    findAll: jest.fn(() => restaurants),
    findById: jest.fn(id => restaurants[0]),
    updateAdmin: jest.fn((id, dto) => ({ id, ...dto, date_joined: new Date() })),
    update: jest.fn((id, dto) => ({ id, ...dto, date_joined: new Date() })),
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

  describe('findAll', () => {
    
    it('should get restaurants', () => {
      const req = {
        user: restaurant
      }

      expect(controller.findAll()).toEqual(restaurants)

      expect(mockAuthService.loginRestaurant).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {

    it('should return a restaurant', async () => {

      expect(await controller.findOne(1)).toEqual(restaurants[0])
    })
  })

  describe('updateAdmin', () => {

    it('should return updated restaurant (Admin)', async () => {
      const dto = { restaurant_name: 'new bites' }
      expect(await controller.updateAdmin(1, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        date_joined: expect.any(Date)
      })
    })
  })

  describe('update', () => {

    it('should return updated restaurant', async () => {
      const dto = { restaurant_name: 'new bites' }
      const req = {
        user: restaurants[0]
      }

      expect(await controller.update(req, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        date_joined: expect.any(Date)
      })
    })
  })

});
