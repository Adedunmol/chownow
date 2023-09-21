import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { CustomerAddress } from './Customer_Address';
import { FoodOrder } from './Food_Order';

@Entity({ name: 'customers' })
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    first_name: string;
    
    @Column()
    last_name: string;

    @Column()
    password: string;

    @CreateDateColumn()
    date_joined: Date;

    @OneToMany(() => FoodOrder, (food) => food.customer)
    food_orders: FoodOrder[]

    @OneToMany(() => CustomerAddress, (customer_address) => customer_address.customer)
    customer_address: CustomerAddress;
}