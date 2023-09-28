import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";

@Injectable()
export class RestaurantStrategy extends PassportStrategy(Strategy, 'RestaurantStrategy') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'restaurant_name',
        });
    }

    async validate(restaurant_name: string, password: string) {
        const customer = await this.authService.validateRestaurant(restaurant_name, password);

        if (!customer) {
            throw new UnauthorizedException();
        }

        return customer;
    }
}