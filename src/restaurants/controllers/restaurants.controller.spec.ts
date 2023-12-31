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
  const menuItems = [{ id: Date.now(), item_name: 'rice', price: 10 }];

  const mockRestaurantsService = {
    create: jest.fn((dto) => { 
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date(), role: 'Restaurant' }
    }),
    findAll: jest.fn(() => restaurants),
    findById: jest.fn(id => restaurants[0]),
    updateAdmin: jest.fn((id, dto) => ({ id, ...dto, date_joined: new Date() })),
    update: jest.fn((id, dto) => ({ id, ...dto, date_joined: new Date() })),
    remove: jest.fn(id => restaurants[0]),
    createMenuItem: jest.fn((id, dto) => { 
      return Promise.resolve({ id: Date.now(), ...dto, restaurant: restaurants[0] }) 
    }),
    updateMenuItem: jest.fn((menuId, restaurantId, dto) => { 
      return Promise.resolve({ id: Date.now(), ...dto, restaurant: restaurants[0] }) 
    }),
    getMenuItem: jest.fn(id => menuItems[0]),
    getMenuItems: jest.fn(id => menuItems),
    removeMenuItem: jest.fn((restaurantId, menuItemId) => ({ ...menuItems[0], restaurant: restaurants[0] }))
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

  describe('removeAdmin', () => {

    it('should remove and return restaurant', async () => {

      expect(await controller.removeAdmin(1)).toEqual(restaurants[0])
    })
  })

  describe('remove', () => {

    it('should remove and return restaurant', async () => {
      const req = {
        user: restaurant
      }

      expect(await controller.remove(req)).toEqual(restaurants[0])
    })
  })

  describe('addMenuItem', () => {

    it('should create a menu item', async () => {
      const req = {
        user: restaurant
      }
      const dto = { item_name: 'rice', price: 10 }

      expect(await controller.addMenuItem(req, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        restaurant: {
          ...restaurants[0]
        }
      })
    })
  })

  describe('updateMenuItem', () => {

    it('should create a menu item', async () => {
      const req = {
        user: restaurant
      }
      const dto = { item_name: 'rice', price: 10 }

      expect(await controller.updateMenuItem(1, req, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        restaurant: {
          ...restaurants[0]
        }
      })
    })
  })

  describe('getMenuItem', () => {

    it('should return a menu item', async () => {

      expect(await controller.getMenuItem(1)).toEqual(menuItems[0])
    })
  })

  describe('getMenuItems', () => {

    it('should return menu items', async () => {
      const req = {
        user: restaurants[0]
      }

      expect(await controller.getMenuItems(req)).toEqual(menuItems)
    })
  })

  describe('removeMenuItem', () => {

    it('should remove and return a menu item', async () => {
      const req = {
        user: restaurant
      }

      expect(await controller.removeMenuItem(1, req)).toEqual({ ...menuItems[0], restaurant: restaurants[0] })
    })
  })
});
