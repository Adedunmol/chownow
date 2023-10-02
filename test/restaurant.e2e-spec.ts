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
import { DriversModule } from '../src/drivers/drivers.module';
import { Driver } from '../src/drivers/entities/driver.entity';
import { Role } from '../src/utils/role.enum';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';


describe('RestaurantController (e2e)', () => {
  let app: INestApplication;

  const restaurants = [{ id: Date.now(), restaurant_name: 'test1', date_joined: new Date(), role: 'Restaurant' }]


  const mockRestaurantsRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    }),
    find: jest.fn(() => restaurants) 
  }

  const customer = {
    id: 1,
    username: 'test',
    first_name: 'test',
    password: 'password',
    last_name: 'user',
    role: Role.USER,
    date_joined: new Date()
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

  const mockCustomersRepository = {
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

  const restaurant = {
    id: 1,
    restaurant_name: 'test',
    password: 'password',
    role: Role.RESTAURANT,
    date_joined: new Date()
  }

  const mockAuthService = {
    validateRestaurant: jest.fn((restaurant_name, password) => restaurant),
    login: jest.fn()
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), RestaurantsModule, AuthModule, DriversModule, CustomersModule],
      providers: [AuthService, JwtService]
    })
    .overrideProvider(getRepositoryToken(Restaurant))
    .useValue(mockRestaurantsRepository)
    .overrideProvider(getRepositoryToken(Customer))
    .useValue(mockCustomersRepository)
    .overrideProvider(getRepositoryToken(Driver))
    .useValue(mockDriversRepository)
    .compile();

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

  describe('/restaurants/', () => {

    it('should get retaurants and return 200 success (users)', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
          .get('/restaurants/').set('Authorization', `Bearer ${access_token}`)
          .expect(200)
    })

    it('should get restaurants and return 200 success (restaurants)', async () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(restaurant))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/restaurants/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(restaurant))
      return request(app.getHttpServer())
          .get('/restaurants/').set('Authorization', `Bearer ${access_token}`)
          .expect(200)
    })

    it('should return 401 unauthorized', () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(null))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .get('/restaurants/')
          .expect(401)
    })
  })

  describe('/restaurants/:id', () => {

    it('should get a restaurant and return 200 success (users)', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
          .get('/restaurants/1').set('Authorization', `Bearer ${access_token}`)
          .expect(200)
    })

    it('should get a restaurant and return 200 success (restaurants)', async () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(restaurant))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/restaurants/login').send(data)).body;

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(restaurant))
      return request(app.getHttpServer())
          .get('/restaurants/1').set('Authorization', `Bearer ${access_token}`)
          .expect(200)
    })

    it('should return 401 unauthorized', () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(null))
      const data = { restaurant_name: 'test', password: 'Password@123' }
      return request(app.getHttpServer())
          .get('/restaurants/')
          .expect(401)
    })
  })

  
  describe('(PATCH) /restaurants/:id (Admin)', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/restaurants/1').send(data)
      .expect(401)
    })

    it('should return 403 forbidden', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { restaurant_name: 'new bites' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
      .patch('/restaurants/1').send(data).set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should update and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { restaurant_name: 'new bites' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .patch('/restaurants/1').set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })

  describe('(PATCH) /restaurants/', () => {

    it('should return 401 unauthorized', () => {
      const data = { username: 'test', first_name: 'test', last_name: 'user' }

      return request(app.getHttpServer())
      .patch('/restaurants/').send(data)
      .expect(401)
    })

    it('should return 403 forbidden for customers', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(customer))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { restaurant_name: 'new bites' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(customer))
      return request(app.getHttpServer())
      .patch('/restaurants/').send(data).set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should return 403 forbidden for admins', async () => {
      jest.spyOn(AuthService.prototype, 'validateCustomer').mockImplementation(async (username, password) => Promise.resolve(admin))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { restaurant_name: 'new bites' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(admin))
      return request(app.getHttpServer())
      .patch('/restaurants/').send(data).set('Authorization', `Bearer ${access_token}`)
      .expect(403)
    })

    it('should update restaurant and return 200 success', async () => {
      jest.spyOn(AuthService.prototype, 'validateRestaurant').mockImplementation(async (username, password) => Promise.resolve(restaurant))
      const data = { username: 'test', password: 'Password@123' }
      const { access_token } = await (await request(app.getHttpServer()).post('/customers/login').send(data)).body;

      const dto = { username: 'test', first_name: 'test', last_name: 'user' }

      jest.spyOn(JwtStrategy.prototype, 'validate').mockImplementation(async (payload) => Promise.resolve(restaurant))
      return request(app.getHttpServer())
      .patch('/restaurants/').send().set('Authorization', `Bearer ${access_token}`)
      .expect(200)
    })
  })
});
