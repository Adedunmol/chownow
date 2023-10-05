import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from '../entities/driver.entity';
import { DriversService } from './drivers.service';

describe('DriversService', () => {
  let service: DriversService;

  const drivers = [{ id: 1, username: 'test1', first_name: 'test1', last_name: 'user1', date_joined: Date.now() }]

  const mockDriversRepository = {
    create: jest.fn(dto => dto),
    save: jest.fn(dto => { 
      const { password, ...others } = dto
      return Promise.resolve({ id: Date.now(), ...others, date_joined: new Date(), role: 'Driver' }) 
    }),
    findOne: jest.fn(query => null),
    find: jest.fn(() => drivers),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, { provide: getRepositoryToken(Driver), useValue: mockDriversRepository }],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('should create a new driver record', async () => {

      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
      const { password, ...others } = dto

      expect(await service.create(dto)).toEqual({
        id: expect.any(Number),
        ...others,
        role: 'Driver',
        date_joined: expect.any(Date)
      })

    })

    it('should throw conflict exception', async () => {
      mockDriversRepository.findOne.mockImplementation((query) => true)

      const dto = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }

      expect(async () => await service.create(dto)).rejects.toEqual(new ConflictException('This username already exists'))

    })
  })

  describe('findDrivers', () => {

    it('should get all drivers', async () => {

      expect(await service.findDrivers()).toEqual(drivers)
    })
  })
});
