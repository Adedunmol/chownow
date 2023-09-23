import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Address } from './Address';
import { FoodOrder } from './Food_Order';
import { MenuItem } from './Menu_Item';

@Entity({ name: 'restaurants' })
export class Restaurant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    restaurant_name: string;

    @ManyToOne(() => Address, (address) => address.restaurant)
    address: Address;

    @OneToMany(() => FoodOrder, (food) => food.customer)
    food_orders: FoodOrder[]

    @OneToMany(() => MenuItem, (menu_item) => menu_item.restaurant)
    menu_items: MenuItem[]
}