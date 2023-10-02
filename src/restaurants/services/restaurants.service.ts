import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { SerializedRestaurant } from '../types';
import { encodePassword } from '../../utils/bcrypt';
import { Restaurant } from '../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsService {

  constructor(@InjectRepository(Restaurant) private readonly restaurantsRepository: Repository<Restaurant>) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<SerializedRestaurant> {
    const restaurant = await this.findByName(createRestaurantDto.restaurant_name);

    if (restaurant) throw new ConflictException('This name already exists');
    
    const password = encodePassword(createRestaurantDto.password);
    const newRestaurant = this.restaurantsRepository.create({ ...createRestaurantDto, password });

    return new SerializedRestaurant(await this.restaurantsRepository.save(newRestaurant))
  }

  async findAll() {
    return (await this.restaurantsRepository.find()).map(customer => new SerializedRestaurant(customer))

  }

  async findByName(restaurant_name: string): Promise<SerializedRestaurant | null> {
    const restaurant = await this.restaurantsRepository.findOne({ where: { restaurant_name } });

    if (!restaurant) return null;

    return new SerializedRestaurant(restaurant)
  }

  findById(id: number) {
    return {}
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
