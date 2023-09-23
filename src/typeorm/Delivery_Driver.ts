import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FoodOrder } from './Food_Order';

@Entity({ name: 'delivery_drivers' })
export class DeliveryDriver {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string; 

    @OneToMany(() => FoodOrder, (food_order) => food_order.assigned_driver)
    food_order: FoodOrder[];
}