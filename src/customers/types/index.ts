import { Exclude } from 'class-transformer';

export class SerializedUser {
    username: string;
    first_name: string;
    last_name: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<SerializedUser>) {
        Object.assign(this, partial)
    }
}