import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/services/customers.service';
import { comparePassword } from '../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SerializedCustomer } from '../customers/types';
import { RestaurantsService } from '../restaurants/services/restaurants.service';
import { SerializedRestaurant } from 'src/restaurants/types';
import { DriversService } from '../drivers/services/drivers.service';
import { SerializedDriver } from '../drivers/types';

@Injectable()
export class AuthService {
    constructor(
        private readonly customersService: CustomersService, 
        private readonly jwtService: JwtService, 
        private readonly restaurantsService: RestaurantsService,
        private readonly driversService: DriversService
    ) {}

    async validateCustomer(username: string, password: string) {
        const customer = await this.customersService.findByUsername(username);

        if (customer && comparePassword(password, customer.password)) {
            return customer;
        }

        return null
    }

    async validateRestaurant(username: string, password: string) {
        const restaurant = await this.restaurantsService.findByName(username);

        if (restaurant && comparePassword(password, restaurant.password)) {
            return restaurant
        }

        return null
    }

    async validateDriver(username: string, password: string) {
        const restaurant = await this.driversService.findByUsername(username);

        if (restaurant && comparePassword(password, restaurant.password)) {
            return restaurant
        }

        return null
    }

    async loginCustomer(customer: SerializedCustomer) {
        const payload = { username: customer.username, sub: customer.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginRestaurant(restaurant: SerializedRestaurant) {
        const payload = { restaurant_name: restaurant.restaurant_name, sub: restaurant.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginDriver(driver: SerializedDriver) {
        const payload = { username: driver.username, sub: driver.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
