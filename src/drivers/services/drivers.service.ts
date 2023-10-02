import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from '../../utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { Driver } from '../entities/driver.entity';
import { SerializedDriver } from '../types';

@Injectable()
export class DriversService {
  
  constructor(@InjectRepository(Driver) private readonly driversRepository: Repository<Driver>) {}

  async create(createDriverDto: CreateDriverDto): Promise<SerializedDriver> {
    const user = await this.findByUsername(createDriverDto.username);

    if (user) throw new ConflictException('This username already exists');
    
    const password = encodePassword(createDriverDto.password);
    const newCustomer = this.driversRepository.create({ ...createDriverDto, password });

    return new SerializedDriver(await this.driversRepository.save(newCustomer))
  }

  async findByUsername(username: string): Promise<SerializedDriver | null> {
    const customer = await this.driversRepository.findOne({ where: { username } });

    if (!customer) return null;

    return new SerializedDriver(customer)
  }

  async findById(id: number) {
    const restaurant = await this.driversRepository.findOne({ where: { id } });

    if (!restaurant) return null;

    return new SerializedDriver(restaurant)
  }

  findAll() {
    return `This action returns all drivers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} driver`;
  }

  update(id: number, updateDriverDto: UpdateDriverDto) {
    return `This action updates a #${id} driver`;
  }

  remove(id: number) {
    return `This action removes a #${id} driver`;
  }
}
