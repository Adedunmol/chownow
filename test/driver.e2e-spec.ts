import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomersModule } from '../src/customers/customers.module';
import { Customer, DeliveryDriver, MenuItem, Restaurant, Address, CustomerAddress } from '../src/typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantsModule } from '../src/restaurants/restaurants.module';
import { DriversModule } from '../src/drivers/drivers.module';
import { Driver } from '../src/drivers/entities/driver.entity';
import { Role } from '../src/utils/role.enum';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { AddressesModule } from '../src/addresses/addresses.module';

describe('DriverController (e2e)', () => {
  let app: INestApplication;

  const driver = {
    id: 1,
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    role: Role.DRIVER,
    date_joined: new Date()
  }

  const drivers = [driver];

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
    }),
    find: jest.fn(() => drivers),
    remove: jest.fn(data => data),
  }

  const mockMenuItemsRepository = {

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
    validateCustomer: jest.fn((username, password) => driver),
    login: jest.fn()
  }

  const mockAddressRepository = {} 
  const mockCustomerAddressRepository = {} 

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), CustomersModule, RestaurantsModule, DriversModule, AuthModule, AddressesModule],
      providers: [AuthService, JwtService]
    })
    .overrideProvider(getRepositoryToken(DeliveryDriver))
    .useValue(mockDriversRepository)
    .overrideProvider(getRepositoryToken(Restaurant))
    .useValue(mockRestaurantsRepository)
    .overrideProvider(getRepositoryToken(Customer))
    .useValue(mockCustomersRepository)
    .overrideProvider(getRepositoryToken(MenuItem))
    .useValue(mockMenuItemsRepository)
    .overrideProvider(getRepositoryToken(Address))
    .useValue(mockAddressRepository)
    .overrideProvider(getRepositoryToken(CustomerAddress))
    .useValue(mockCustomerAddressRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('(POST) /drivers/register', () => {

    it('should return 201 created', () => {
        const data = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/drivers/register').send(data)
          .expect(201)
    })

    it('should return 400 bad request', () => {
        return request(app.getHttpServer())
          .post('/drivers/register').send({  })
          .expect(400)
          .then(response => {
            expect(response.body['error']).toEqual('Bad Request');
          })
      })

    it('should return 409 conflict', () => {
        mockDriversRepository.findOne.mockImplementation(query => true)
        const data = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/drivers/register').send(data)
          .expect(409)
          .then(response => {
            expect(response.body['error']).toEqual('Conflict');
          })
    })
  })

  describe('(POST) /drivers/login', () => {

    it('should return 200 success', () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/drivers/login').send(data)
          .expect(200).then(response => {
            expect(response.body).toEqual({ access_token: expect.any(String) })
      })
    })

    it('should return 401 unauthorized', () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(null))
      const data = { username: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .post('/drivers/login').send(data)
          .expect(401).then(response => {
            expect(response.body).toEqual({ message: 'Unauthorized', statusCode: 401 })
      })
    })
  })

  describe('(GET) /drivers/ (Admin)', () => {

    it('should return 401 unauthorized', () => {

      return request(app.getHttpServer())
      .get('/drivers/')
      .expect(401)
    })

    it('should get drivers and return 200 success', async () => {

      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .get('/drivers/').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(driver))
      return request(app.getHttpServer())
      .get('/drivers/').set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })
  })

  describe('(GET) /drivers/:id', () => {

    it('should return 401 unauthorized', () => {

      return request(app.getHttpServer())
      .get('/drivers/1')
      .expect(401)
    })

    it('should get a driver and return 200 success', async () => {

      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/drivers/login').send(data)).body;

      return request(app.getHttpServer())
      .get('/drivers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })

  describe('(PATCH) /drivers/:id (Admin)', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/drivers/1').send(data)
      .expect(401)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(driver))
      return request(app.getHttpServer())
      .patch('/drivers/1').send(dto).set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should update and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .patch('/drivers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })

  describe('(PATCH) /drivers/', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/drivers/').send(data)
      .expect(401)
    })

    it('should update and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(driver))
      return request(app.getHttpServer())
      .patch('/drivers/').send().set('Authorization', `Bearer ${access_token}`)
      .expect(200) //.then(response => console.log(response.body['error'])).catch(err => console.log(err))
    })
  })
  
  describe('(DELETE) /drivers/:id (Admin)', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .delete('/drivers/1')
      .expect(401)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(driver))
      return request(app.getHttpServer())
      .delete('/drivers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should delete driver and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .delete('/drivers/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })
  
  describe('(DELETE) /drivers/', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .delete('/customers/')
      .expect(401)
    })

    it('should delete driver and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateDriver').mockImplementation(async (username, password) => Promise.resolve(driver))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/drivers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(driver))
      return request(app.getHttpServer())
      .delete('/drivers/').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })
});