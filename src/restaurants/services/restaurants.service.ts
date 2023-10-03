import { Injectable, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantAdminDto, UpdateRestaurantDto } from '../dto/update-restaurant.dto';
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
    return (await this.restaurantsRepository.find()).map(restaurant => new SerializedRestaurant(restaurant))

  }

  async findByName(restaurant_name: string): Promise<SerializedRestaurant | null> {
    const restaurant = await this.restaurantsRepository.findOne({ where: { restaurant_name } });

    if (!restaurant) return null;

    return new SerializedRestaurant(restaurant)
  }

  async findById(id: number) {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id } });

    if (!restaurant) return null;

    return new SerializedRestaurant(restaurant)
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.findById(id);

    if (!restaurant) throw new NotFoundException('No restaurant with this id');

    restaurant.restaurant_name = updateRestaurantDto.restaurant_name || restaurant.restaurant_name;
    restaurant.password = updateRestaurantDto.password ? encodePassword(updateRestaurantDto.password) : restaurant.restaurant_name;

    return new SerializedRestaurant(await this.restaurantsRepository.save(restaurant)); 
  }

  async updateAdmin(id: number, updateRestaurantAdminDto: UpdateRestaurantAdminDto) {
    const restaurant = await this.findById(id);

    if (!restaurant) throw new NotFoundException('No restaurant with this id');

    restaurant.restaurant_name = updateRestaurantAdminDto.restaurant_name || restaurant.restaurant_name;

    return new SerializedRestaurant(await this.restaurantsRepository.save(restaurant));  
  }

  async remove(id: number) {
    const restaurant = await this.restaurantsRepository.findOne({ where: { id } });

    if (!restaurant) throw new NotFoundException('No customer with this id');

    const result = await this.restaurantsRepository.remove(restaurant);

    return result;
  }
}
