import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { SerializedCustomer } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Customer } from '../../typeorm';
import { encodePassword } from '../../utils/bcrypt';

@Injectable()
export class CustomersService {

  constructor(@InjectRepository(Customer) private readonly customersRepository: Repository<Customer>) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<SerializedCustomer> {
    const user = await this.findByUsername(createCustomerDto.username);

    if (user) throw new ConflictException('This username already exists');
    
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

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
