import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from '../../typeorm';
import { RestaurantsService } from './restaurants.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]

  const mockRestaurantsRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date(), role: 'Restaurant' }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(() => restaurants),
    findAll: jest.fn(() => restaurants)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantsService, { provide: getRepositoryToken(Restaurant), useValue: mockRestaurantsRepository }],
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
});
