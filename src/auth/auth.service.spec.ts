import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '../customers/services/customers.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockCustomersService = {
    create: jest.fn((dto) => {
      const { password, ...others } = dto;
      return { id: Date.now(), ...others, date_joined: new Date() }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, CustomersService, JwtService],
    }).overrideProvider(CustomersService).useValue(mockCustomersService).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
