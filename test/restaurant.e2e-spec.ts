import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Customer, Restaurant } from '../src/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantsModule } from '../src/restaurants/restaurants.module';
import { CustomersModule } from '../src/customers/customers.module';

describe('RestaurantController (e2e)', () => {
  let app: INestApplication;

  const mockRestaurantsRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  const mockCustomersRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  const restaurant = {
    id: 1,
    restaurant_name: 'test',
    password: 'password',
    date_joined: new Date()
  }

  const mockAuthService = {
    validateRestaurant: jest.fn((restaurant_name, password) => restaurant),
    login: jest.fn()
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), RestaurantsModule, AuthModule, CustomersModule],
      providers: [AuthService, JwtService]
    }).overrideProvider(getRepositoryToken(Restaurant)).useValue(mockRestaurantsRepository).overrideProvider(getRepositoryToken(Customer)).useValue(mockCustomersRepository).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/restaurants/register', () => {

    it('should return 201 created', () => {
        const data = { restaurant_name: 'test', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/restaurants/register').send(data)
          .expect(201)
    })

    it('should return 400 bad request', () => {
        return request(app.getHttpServer())
          .post('/restaurants/register').send({ })
          .expect(400)
          .then(response => {
            expect(response.body['error']).toEqual('Bad Request');
          })
      })

    it('should return 409 conflict', () => {
        mockRestaurantsRepository.findOne.mockImplementation(query => true)
        const data = { restaurant_name: 'test', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/restaurants/register').send(data)
          .expect(409)
          .then(response => {
            expect(response.body['error']).toEqual('Conflict');
          })
    })
  })

  describe('/restaurants/login', () => {

    it('should return 200 success', () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(restaurant))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/restaurants/login').send(data)
          .expect(200).then(response => {
            expect(response.body).toEqual({ access_token: expect.any(String) })
          })
    })

    it('should return 401 unauthorized', () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(null))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/restaurants/login').send(data)
          .expect(401).then(response => {
            expect(response.body).toEqual({ message: 'Unauthorized', statusCode: 401 })
          })
    })
  })
});
