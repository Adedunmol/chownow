import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { UpdateCustomerAdminDto, UpdateCustomerDto } from '../dto/update-customer.dto';
import { SerializedCustomer } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Customer } from '../../typeorm';
import { encodePassword } from '../../utils/bcrypt';

@Injectable()
export class CustomersService {

  constructor(@InjectRepository(Customer) private readonly customersRepository: Repository<Customer>) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<SerializedCustomer> {
    const customer = await this.findByUsername(createCustomerDto.username);

    if (customer) throw new ConflictException('This username already exists');
    
    const password = encodePassword(createCustomerDto.password);
    const newCustomer = this.customersRepository.create({ ...createCustomerDto, password });

    return new SerializedCustomer(await this.customersRepository.save(newCustomer))
  }

  async findCustomers() {
    // @UseInterceptors(ClassSerializerInterceptor) to decorate the controller using it
    return (await this.customersRepository.find()).map(customer => new SerializedCustomer(customer))
  }

  async findByUsername(username: string): Promise<SerializedCustomer | null> {
    const customer = await this.customersRepository.findOne({ where: { username } });

    if (!customer) return null;

    return new SerializedCustomer(customer)
  }

  async findById(id: number): Promise<SerializedCustomer | null> {
    const customer = await this.customersRepository.findOne({ where: { id } });

    if (!customer) return null;

    return new SerializedCustomer(customer)
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  async updateAdmin(id: number, updateCustomerAdminDto: UpdateCustomerAdminDto) {
    const customer = await this.findById(id);

    if (!customer) throw new NotFoundException('No customer with this id');

    customer.first_name = updateCustomerAdminDto.first_name || customer.first_name;
    customer.last_name = updateCustomerAdminDto.last_name || customer.last_name;
    customer.username = updateCustomerAdminDto.username || customer.username;

    return new SerializedCustomer(await this.customersRepository.save(customer));
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findById(id);

    if (!customer) throw new NotFoundException('No customer with this id');

    customer.first_name = updateCustomerDto.first_name || customer.first_name;
    customer.last_name = updateCustomerDto.last_name || customer.last_name;
    customer.username = updateCustomerDto.username || customer.username;
    customer.password = updateCustomerDto.password ? encodePassword(updateCustomerDto.password) : customer.password;

    return new SerializedCustomer(await this.customersRepository.save(customer));
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
