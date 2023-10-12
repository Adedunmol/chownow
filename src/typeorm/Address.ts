import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
// import { Country } from './Country';
import { CustomerAddress } from './Customer_Address';
import { Restaurant } from './Restaurant';

@Entity({ name: 'addresses' })
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street_number: number;

    @Column()
    address_line1: string;

    @Column({ nullable: true })
    address_line2: string;

    @Column()
    city: string;

    @Column()
    region: string;

    @Column()
    postal_code: string;

    // @ManyToOne(() => Country, (country) => country.address)
    // country: Country;

    @OneToMany(() => CustomerAddress, (customer_address) => customer_address.address)
    customer_address: CustomerAddress[];

    @OneToMany(() => Restaurant, (restaurant) => restaurant.address)
    restaurant: Restaurant[];
}