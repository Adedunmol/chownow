import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address, Customer, CustomerAddress, Restaurant } from '../../typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressesService {

  constructor(
    @InjectRepository(Address) private readonly addressesService: Repository<Address>,
    @InjectRepository(CustomerAddress) private readonly customerAddressesService: Repository<CustomerAddress>,
    @InjectRepository(Restaurant) private readonly restaurantsService: Repository<Restaurant>,
    @InjectRepository(Customer) private readonly customersService: Repository<Restaurant>,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  async createRestaurantAddress(restaurantId: number, createAddressDto: CreateAddressDto) {
    const restaurant = await this.restaurantsService.findOne({ where: { id: restaurantId } });

    if (!restaurant) throw new NotFoundException('No restaurant with this id');

    const address = this.addressesService.create({ ...createAddressDto });

    const savedAddress = await this.addressesService.save(address);

    restaurant.address = savedAddress;

    const updatedRestaurant = await this.restaurantsService.save(restaurant);

    return updatedRestaurant;
  }

  async createCustomerAddress(customerId: number, createAddressDto: CreateAddressDto) {
    const customer = await this.customersService.findOne({ where: { id: customerId } });

    if (!customer) throw new NotFoundException('No customer with this id');

    const address = this.addressesService.create({ ...createAddressDto });

    const customerAddress = this.customerAddressesService.create({ customer, address });

    const savedAddress = await this.customerAddressesService.save(customerAddress);

    return savedAddress;
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
