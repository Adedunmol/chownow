import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Address } from './Address';
import { Customer } from './Customer';
import { FoodOrder } from './Food_Order';

@Entity({ name: 'customer_addresses' })
export class CustomerAddress {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.customer_address)
    customer: Customer;

    @ManyToOne(() => Address, (address) => address.customer_address)
    address: Address;

    @OneToMany(() => FoodOrder, (food_order) => food_order.customer_address)
    food_order: FoodOrder[];
}