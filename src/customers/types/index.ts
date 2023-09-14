import { Exclude } from 'class-transformer';

export class SerializedCustomer {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    date_joined: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedCustomer>) {
        Object.assign(this, partial)
    }
}