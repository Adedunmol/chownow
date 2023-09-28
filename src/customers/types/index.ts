import { Exclude } from 'class-transformer';
import { Role } from '../../utils/role.enum';

export class SerializedCustomer {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    date_joined: Date;
    role: Role

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedCustomer>) {
        Object.assign(this, partial)
    }
}