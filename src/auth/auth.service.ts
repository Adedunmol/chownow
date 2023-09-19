import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/services/customers.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SerializedCustomer } from '../customers/types';

@Injectable()
export class AuthService {
    constructor(private customersService: CustomersService, private jwtService: JwtService) {}

    async validateCustomer(username: string, password: string) {
        const customer = await this.customersService.findByUsername(username);

        if (customer && comparePassword(password, customer.password)) {
            return customer;
        }

        return null
    }

    async login(customer: SerializedCustomer) {
        const payload = { username: customer.username, sub: customer.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
