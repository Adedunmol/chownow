import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Restaurant } from '../src/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from '../src/restaurants/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../src/restaurants/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantsModule } from '../src/restaurants/restaurants.module';

describe('RestaurantController (e2e)', () => {
  let app: INestApplication;

  const mockRestaurantsRepository = {
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
      imports: [ConfigModule.forRoot({ isGlobal: true }), RestaurantsModule, AuthModule],
      providers: [AuthService, JwtService]
    }).overrideProvider(getRepositoryToken(Restaurant)).useValue(mockRestaurantsRepository).compile();

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

});
