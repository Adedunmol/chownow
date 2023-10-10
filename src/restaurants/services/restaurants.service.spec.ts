import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem, Restaurant } from '../../typeorm';
import { RestaurantsService } from './restaurants.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]
  const menuItems = [{ id: Date.now(), item_name: 'rice', price: 10 }];

  const mockRestaurantsRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date(), role: 'Restaurant' }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(() => restaurants),
    findAll: jest.fn(() => restaurants),
    remove: jest.fn(data => data)
  };

  const mockMenuItemsRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn(dto => { 
      return Promise.resolve({ id: Date.now(), ...dto, restaurant: restaurants[0] }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(query => menuItems),
    remove: jest.fn(data => data)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantsService, { 
        provide: getRepositoryToken(Restaurant), 
        useValue: mockRestaurantsRepository 
      }, {
        provide: getRepositoryToken(MenuItem),
        useValue: mockMenuItemsRepository
      }],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('should create a new restaurant record', async () => {

      const dto = { restaurant_name: 'test', password: 'Password@123' }
      const { password, ...others } = dto

      expect(await service.create(dto)).toEqual({
        id: expect.any(Number),
        ...others,
        role: 'Restaurant',
        date_joined: expect.any(Date)
      })

    })

    it('should throw conflict exception', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => true)

      const dto = { restaurant_name: 'test', password: 'Password@123' }

      expect(async () => await service.create(dto)).rejects.toEqual(new ConflictException('This name already exists'))

    })
  })

  describe('findByName', () => {

    it('should get a restaurant', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])

      expect(await service.findByName('test1')).toEqual(restaurants[0])
    })

    it('should return null', async () => {

      expect(await service.findByName('test1')).toEqual(restaurants[0])
    })
  })

  describe('findAll', () => {

    it('should get all restaurants', async () => {
      mockRestaurantsRepository.findAll.mockImplementation(() => restaurants)

      expect(await service.findAll()).toEqual(restaurants)
    })
  })

  describe('findById', () => {

    it('should get a restaurant', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])

      expect(await service.findById(1)).toEqual(restaurants[0])
    })

    it('should return null', async () => {

      expect(await service.findById(1)).toEqual(restaurants[0])
    })
  })

  describe('updateAdmin', () => {

    it('should update a restaurant (admin)', async () => {
      const dto = { restaurant_name: 'new bites' }

      expect(await service.updateAdmin(123, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        role: 'Restaurant',
        date_joined: expect.any(Date)
      })
    })

    it('should throw NotFoundException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)
      const dto = { restaurant_name: 'new bites' }

      expect(async () => await service.updateAdmin(1, dto)).rejects.toEqual(new NotFoundException('No restaurant with this id'))

    })
  })

  describe('update', () => {

    it('should update a restaurant', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      const dto = { restaurant_name: 'new bites' }

      expect(await service.update(1, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        role: 'Restaurant',
        date_joined: expect.any(Date)
      })
    })

    it('should throw NotFoundException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)
      const dto = { restaurant_name: 'new bites' }

      expect(async () => await service.update(1, dto)).rejects.toEqual(new NotFoundException('No restaurant with this id'))

    })
  })

  describe('remove', () => {

    it('should throw NotFoundException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)

      expect(async () => await service.remove(1)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })

    it('should remove a restaurant', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])

      expect(await service.remove(1)).toEqual({
        id: expect.any(Number),
        ...restaurants[0],
        role: 'Restaurant',
        date_joined: expect.any(Date)
      })
    })
  })

  describe('createMenuItem', () => {

    it('should throw NotFoundException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)
      const dto = { item_name: 'rice', price: 10 }
      expect(async () => await service.createMenuItem(1, dto)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })

    it('should throw ConflictException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => menuItems[0])

      const dto = { item_name: 'rice', price: 10 }
      expect(async () => await service.createMenuItem(1, dto)).rejects.toEqual(new ConflictException('Menu item already exists'))
    })

    it('should create a new menu item', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => null)

      const dto = { item_name: 'rice', price: 10 }
      expect(await service.createMenuItem(1, dto)).toEqual({
        id: expect.any(Number),
        ...dto,
        restaurant: {
          ...restaurants[0]
        }
      })
    })
  })

  describe('updateMenuItem', () => {

    it('should throw NotFoundException for restaurant not found', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)
      const dto = { item_name: 'rice', price: 10 }
      expect(async () => await service.updateMenuItem(1, 1, dto)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })

    it('should throw NotFoundException for menu item not found', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => null)

      const dto = { item_name: 'rice', price: 10 }
      expect(async () => await service.updateMenuItem(1, 1, dto)).rejects.toEqual(new NotFoundException('No menu item with this id'))
    })

    it('should throw ConflictException', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => menuItems[0])

      const dto = { item_name: 'rice', price: 10 }
      expect(async () => await service.updateMenuItem(1, 1, dto)).rejects.toEqual(new ConflictException('Menu item already exists'))
    })

    it('should update a menu item', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => menuItems[0])

      const dto = { price: 15 }
      expect(await service.updateMenuItem(1, 1, dto)).toEqual({
        id: expect.any(Number),
        item_name: 'rice',
        ...dto,
        restaurant: {
          ...restaurants[0]
        }
      })
    })
  })

  describe('getMenuItem', () => {

    it('should get a menu item', async () => {
      mockMenuItemsRepository.findOne.mockImplementation((query) => menuItems[0])

      expect(await service.getMenuItem(1)).toEqual(menuItems[0])
    })

    it('should throw NotFoundException', async () => {
      mockMenuItemsRepository.findOne.mockImplementation((query) => null)

      expect(async () => await service.getMenuItem(1)).rejects.toEqual(new NotFoundException('No menu item with this id'))
    })
  })

  describe('getMenuItems', () => {

    it('should get menu items', async () => {

      expect(await service.getMenuItems(1)).toEqual(menuItems)
    })

    it('should return null', async () => {
      mockRestaurantsRepository.findOne.mockImplementation(query => null)

      expect(async () => await service.getMenuItems(1)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })
  })

  describe('removeMenuItem', () => {

    it('should throw NotFoundException for restaurants', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => null)

      expect(async () => await service.removeMenuItem(1, 1)).rejects.toEqual(new NotFoundException('No restaurant with this id'))
    })

    it('should throw NotFoundException for menu items', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => null)

      expect(async () => await service.removeMenuItem(1, 1)).rejects.toEqual(new NotFoundException('No menu item with this id'))
    })

    it('should remove a menu item', async () => {
      mockRestaurantsRepository.findOne.mockImplementation((query) => restaurants[0])
      mockMenuItemsRepository.findOne.mockImplementation((query) => menuItems[0])

      expect(await service.removeMenuItem(1, 1)).toEqual(menuItems[0])
    })
  })
});
