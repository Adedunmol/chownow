import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { FoodOrder } from './Food_Order';

@Entity({ name: 'delivery_drivers' })
export class DeliveryDriver {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;
    
    @Column()
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    date_joined: Date;

    @OneToMany(() => FoodOrder, (food_order) => food_order.assigned_driver)
    food_order: FoodOrder[];
}