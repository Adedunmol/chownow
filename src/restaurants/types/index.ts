import { Exclude } from 'class-transformer';
import { Role } from '../../utils/role.enum';

export class SerializedRestaurant {

    id: number;
    restaurant_name: string;
    date_joined: Date;
    role: Role

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedRestaurant>) {
        Object.assign(this, partial)
    }
}