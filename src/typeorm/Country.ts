import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Address } from './Address';


@Entity({ name: 'countries' })
export class Country {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Address, (address) => address.country)
    address: Address[];
}