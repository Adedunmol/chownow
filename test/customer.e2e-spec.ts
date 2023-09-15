import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomersModule } from '../src/customers/customers.module';
import { Customer } from '../src/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  const mockUsersRepository = {
    create: jest.fn(dto => dto),
    findOne: jest.fn(query => null),
    save: jest.fn(dto => {
        return Promise.resolve({ id: Date.now(), ...dto, date_joined: new Date() })
    })
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CustomersModule],
    }).overrideProvider(getRepositoryToken(Customer)).useValue(mockUsersRepository).compile();

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
        mockUsersRepository.findOne.mockImplementation(query => true)
        const data = { username: 'test', first_name: 'test', last_name: 'user', password: 'Password@123' }
        return request(app.getHttpServer())
          .post('/customers/register').send(data)
          .expect(409)
          .then(response => {
            expect(response.body['error']).toEqual('Conflict');
          })
    })
  })

  
});
