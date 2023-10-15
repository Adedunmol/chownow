import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { AddressesModule } from '../src/addresses/addresses.module';
import { AddressesService } from '../src/addresses/services/addresses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address, Customer, CustomerAddress, DeliveryDriver, MenuItem, Restaurant } from '../src/typeorm';
import { RestaurantsModule } from '../src/restaurants/restaurants.module';
import { CustomersModule } from '../src/customers/customers.module';
import { DriversModule } from '../src/drivers/drivers.module';
import { AuthModule } from '../src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

describe('AddressController (e2e)', () => {
  let app: INestApplication;

  const mockAddressRepository = {} 
  const mockRestaurantRepository = {} 
  const mockCustomerRepository = {} 
  const mockCustomerAddressRepository = {} 
  const mockMenuItemRepository = {} 
  const mockDriverRepository = {} 

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), CustomersModule, AddressesModule,  DriversModule, RestaurantsModule, AuthModule],
      providers: [AddressesService, JwtService]
    })
    .overrideProvider(getRepositoryToken(DeliveryDriver))
    .useValue(mockDriverRepository)
    .overrideProvider(getRepositoryToken(Address))
    .useValue(mockAddressRepository)
    .overrideProvider(getRepositoryToken(CustomerAddress))
    .useValue(mockCustomerAddressRepository)
    .overrideProvider(getRepositoryToken(Customer))
    .useValue(mockCustomerRepository)
    .overrideProvider(getRepositoryToken(Restaurant))
    .useValue(mockRestaurantRepository)
    .overrideProvider(getRepositoryToken(MenuItem))
    .useValue(mockMenuItemRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('(POST) /addresses/restaurants', () => {

    it('should return 401 unauthorized', async () => {

    return request(app.getHttpServer())
      .get('/addresses/customers/')
      .expect(401)
    })
  })
});
