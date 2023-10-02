import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomersService } from '../../customers/services/customers.service';
import { CustomerPayload, DriverPayload, RestaurantPayload } from '../types';
import { ConfigService } from '@nestjs/config';
import { RestaurantsService } from '../../restaurants/services/restaurants.service';
import { DriversService } from '../../drivers/services/drivers.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly customersService: CustomersService, 
        private readonly restaurantsService: RestaurantsService, 
        private readonly driversService: DriversService, 
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload: CustomerPayload | RestaurantPayload | DriverPayload) {

        if (payload.role === 'Customer') {
            const customer = await this.customersService.findById(payload.sub);
            return customer;
        }

        if (payload.role === 'Restaurant') {
            const restaurant = await this.restaurantsService.findById(payload.sub);
            return restaurant;
        }

        if (payload.role === 'Driver') {
            const driver = this.driversService.findById(payload.sub);
            return driver;
        }
    }
}