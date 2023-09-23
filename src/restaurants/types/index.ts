import { Exclude } from 'class-transformer';

export class SerializedRestaurant {

    id: number;
    restaurant_name: string;
    date_joined: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedRestaurant>) {
        Object.assign(this, partial)
    }
}