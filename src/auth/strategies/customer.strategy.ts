import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";

@Injectable()
export class CustomerStrategy extends PassportStrategy(Strategy, 'CustomerStrategy') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const customer = await this.authService.validateCustomer(username, password);

        if (!customer) {
            throw new UnauthorizedException();
        }

        return customer;
    }
}