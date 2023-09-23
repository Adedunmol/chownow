import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FoodOrder } from './Food_Order';

@Entity({ name: 'order_statuses' })
export class OrderStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status_value: string; // an enum ['submitted', 'accepted by restaurant', 'preparing order', 'ready for pickup', 'delivery in progress', 'delivered', 'order cancelled']; allow drivers and restaurants change the value

    @OneToMany(() => FoodOrder, (food_order) => food_order.order_status)
    food_order: FoodOrder[];
}