import { Injectable, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { UpdateRestaurantAdminDto, UpdateRestaurantDto } from '../dto/update-restaurant.dto';
import { SerializedRestaurant } from '../types';
import { encodePassword } from '../../utils/bcrypt';
import { MenuItem, Restaurant } from '../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';

@Injectable()
export class RestaurantsService {

  constructor(
    @InjectRepository(Restaurant) private readonly restaurantsRepository: Repository<Restaurant>,
    @InjectRepository(MenuItem) private readonly menuItemsRepository: Repository<MenuItem>
  ) {}

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

    if (!restaurant) throw new NotFoundException('No restaurant with this id');

    const result = await this.restaurantsRepository.remove(restaurant);

    return result;
  }

  async createMenuItem(restaurantId: number, createMenuItem: CreateMenuItemDto) {
    const restaurant = await this.findById(restaurantId);

    if (!restaurant) throw new NotFoundException('No restaurant with this id');

    const foundItem = await this.menuItemsRepository.findOne({ where: { restaurant: { id: restaurantId }, item_name: createMenuItem.item_name } });

    if (foundItem) throw new ConflictException('Menu item already exists');

    const menuItem = this.menuItemsRepository.create({ ...createMenuItem, restaurant });

    const { restaurant: { password, ...restaurantValue }, ...others } = await this.menuItemsRepository.save(menuItem);

    return {  ...others, restaurant: restaurantValue };
  }
}
