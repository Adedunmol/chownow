import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from '../../typeorm';
import { RestaurantsService } from './restaurants.service';
import { ConflictException } from '@nestjs/common';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date() }]

  const mockRestaurantsRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date() }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(() => restaurants),
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
});
