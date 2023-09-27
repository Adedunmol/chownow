import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomersModule } from '../src/customers/customers.module';
import { Customer, Restaurant } from '../src/typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantsModule } from '../src/restaurants/restaurants.module';
import { Driver } from '../src/drivers/entities/driver.entity';
import { DriversModule } from '../src/drivers/drivers.module';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  const mockCustomersRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  const mockRestaurantsRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  const mockDriversRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  const customer = {
    id: 1,
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    date_joined: new Date()
  }

  const mockAuthService = {
    validateCustomer: jest.fn((username, password) => customer),
    login: jest.fn()
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), CustomersModule, RestaurantsModule, DriversModule, AuthModule],
      providers: [AuthService, JwtService]
    })
    .overrideProvider(getRepositoryToken(Customer))
    .useValue(mockCustomersRepository)
    .overrideProvider(getRepositoryToken(Restaurant))
    .useValue(mockRestaurantsRepository)
    .overrideProvider(getRepositoryToken(Driver))
    .useValue(mockDriversRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/customers/register', () => {

    it('should return 201 created', () => {
        const data = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/customers/register').send(data)
          .expect(201)
    })

    it('should return 400 bad request', () => {
        return request(app.getHttpServer())
          .post('/customers/register').send({  })
          .expect(400)
          .then(response => {
            expect(response.body['error']).toEqual('Bad Request');
          })
      })

    it('should return 409 conflict', () => {
        mockCustomersRepository.findOne.mockImplementation(query => true)
        const data = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/customers/register').send(data)
          .expect(409)
          .then(response => {
            expect(response.body['error']).toEqual('Conflict');
          })
    })
  })

  describe('/customers/login', () => {

    it('should return 200 success', () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/customers/login').send(data)
          .expect(200).then(response => {
            expect(response.body).toEqual({ access_token: expect.any(String) })
          })
    })

    it('should return 401 unauthorized', () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(null))
      const data = { username: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/customers/login').send(data)
          .expect(401).then(response => {
            expect(response.body).toEqual({ message: 'Unauthorized', statusCode: 401 })
          })
    })
  })  
});