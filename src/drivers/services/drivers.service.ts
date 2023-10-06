import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from '../../utils/bcrypt';
import { Repository } from 'typeorm';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverAdminDto, UpdateDriverDto } from '../dto/update-driver.dto';
import { Driver } from '../entities/driver.entity';
import { SerializedDriver } from '../types';

@Injectable()
export class DriversService {
  
  constructor(@InjectRepository(Driver) private readonly driversRepository: Repository<Driver>) {}

  async create(createDriverDto: CreateDriverDto): Promise<SerializedDriver> {
    const driver = await this.findByUsername(createDriverDto.username);

    if (driver) throw new ConflictException('This username already exists');
    
    const password = encodePassword(createDriverDto.password);
    const newDriver = this.driversRepository.create({ ...createDriverDto, password });

    return new SerializedDriver(await this.driversRepository.save(newDriver))
  }

  async findByUsername(username: string): Promise<SerializedDriver | null> {
    const driver = await this.driversRepository.findOne({ where: { username } });

    if (!driver) return null;

    return new SerializedDriver(driver)
  }

  async findById(id: number) {
    const restaurant = await this.driversRepository.findOne({ where: { id } });

    if (!restaurant) return null;

    return new SerializedDriver(restaurant)
  }

  async findDrivers() {
    // @UseInterceptors(ClassSerializerInterceptor) to decorate the controller using it
    return (await this.driversRepository.find()).map(driver => new SerializedDriver(driver))
  }

  async updateAdmin(id: number, updateDriverAdminDto: UpdateDriverAdminDto) {
    const driver = await this.findById(id);

    if (!driver) throw new NotFoundException('No driver with this id');

    driver.first_name = updateDriverAdminDto.first_name || driver.first_name;
    driver.last_name = updateDriverAdminDto.last_name || driver.last_name;
    driver.username = updateDriverAdminDto.username || driver.username;

    return new SerializedDriver(await this.driversRepository.save(driver));
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    const driver = await this.findById(id);

    if (!driver) throw new NotFoundException('No driver with this id');

    driver.first_name = updateDriverDto.first_name || driver.first_name;
    driver.last_name = updateDriverDto.last_name || driver.last_name;
    driver.username = updateDriverDto.username || driver.username;
    driver.password = updateDriverDto.password ? encodePassword(updateDriverDto.password) : driver.password;

    return new SerializedDriver(await this.driversRepository.save(driver));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} driver`;
  // }

  async remove(id: number) {
    const driver = await this.driversRepository.findOne({ where: { id } });

    if (!driver) throw new NotFoundException('No driver with this id');

    const result = await this.driversRepository.remove(driver);

    return result;
  }
}
