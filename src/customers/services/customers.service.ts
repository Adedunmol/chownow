import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { SerializedUser } from '../types';

@Injectable()
export class CustomersService {

  private customers = [
    {
      username: 'user1',
      first_name: 'user',
      last_name: 'test',
      password: '123455667'
    },
    {
      username: 'user2',
      first_name: 'user2',
      last_name: 'test',
      password: '123455667'
    },
    {
      username: 'user3',
      first_name: 'user3',
      last_name: 'test',
      password: '123455667'
    },
  ]

  create(createCustomerDto: CreateCustomerDto) {
    return 'Create customer'
  }

  login(loginCustomerDto: LoginCustomerDto) {
    return 'Login customer'
  }

  getCustomers() {
    // @UseInterceptors(ClassSerializerInterceptor) to decorate tge controller using it
    return this.customers.map(customer => new SerializedUser(customer))
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
