import { Injectable } from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import { comparePassword } from '../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SerializedRestaurant } from '../types';

@Injectable()
export class AuthService {
    constructor(private restaurantsService: RestaurantsService, private jwtService: JwtService) {}

    async validateRestaurant(username: string, password: string) {
        const restaurant = await this.restaurantsService.findByName(username);

        if (restaurant && comparePassword(password, restaurant)) {
            return restaurant
        }

        return null
    }

    async login(restaurant: SerializedRestaurant) {
        const payload = { name: restaurant.restaurant_name, sub: restaurant.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
