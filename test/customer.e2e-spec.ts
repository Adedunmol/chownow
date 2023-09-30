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
import { Role } from '../src/utils/role.enum';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  const customer = {
    id: 1,
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    role: Role.USER,
    date_joined: new Date()
  }
  
  const customers = [customer];

  const mockCustomersRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date(), role: 'User' })
    }),
    find: jest.fn(() => customers)
  }

  const mockRestaurantsRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date(), role: 'Restaurant' })
    })
  }

  const mockDriversRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date(), role: 'Driver' })
    })
  }

  const admin = {
    id: 1,
    username: 'Admin',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    role: Role.ADMIN,
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

  describe('(POST) /customers/register', () => {

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

  describe('(POST) /customers/login', () => {

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
  
  describe('(GET) /customers/:id', () => {

    it('should return 401 unauthorized', () => {

      return request(app.getHttpServer())
      .get('/customers/1')
      .expect(401)
    })

    it('should return 200 success', async () => {

      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      return request(app.getHttpServer())
      .get('/customers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })
  
  describe('(GET) /customers/ (Admin)', () => {

    it('should return 401 unauthorized', () => {

      return request(app.getHttpServer())
      .get('/customers/')
      .expect(401)
    })

    it('should return 200 success', async () => {

      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .get('/customers/').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
      .get('/customers/').set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })
  })

  describe('(PATCH) /customers/:id (Admin)', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/customers/1').send(data)
      .expect(401)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
      .patch('/customers/1').send(data).set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .patch('/customers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })

  describe('(PATCH) /customers/', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/customers/').send(data)
      .expect(401)
    })

    it('should return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .patch('/customers/').send().set('Authorization', `Bearer ${access_token}`)
      .expect(200) //.then(response => console.log(response.body['error'])).catch(err => console.log(err))
    })
  })
});