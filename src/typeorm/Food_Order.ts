import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Customer } from './Customer';
import { CustomerAddress } from './Customer_Address';
import { DeliveryDriver } from './Delivery_Driver';
import { OrderStatus } from './Order_Status';
import { Restaurant } from './Restaurant';

@Entity({ name: 'food_orders' })
export class FoodOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    order_datetime: Date; // when the order is placed

    @Column()
    requested_delivery_datetime: Date; // now or later

    @Column()
    customer_driver_rating: number;

    @Column()
    customer_restaurant_rating: number;

    @Column()
    delivery_fee: number;

    @Column()
    total_amount: number;

    @ManyToOne(() => Customer, (customer) => customer.food_orders)
    customer: Customer;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.food_orders)
    restaurant: Restaurant;

    @ManyToOne(() => OrderStatus, (order_status) => order_status.food_order)
    order_status: OrderStatus;

    @ManyToOne(() => DeliveryDriver, (delivery_driver) => delivery_driver.food_order)
    assigned_driver: DeliveryDriver;

    @ManyToOne(() => CustomerAddress, (customer_address) => customer_address.food_order)
    customer_address: CustomerAddress;
}