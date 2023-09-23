import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OrderMenuItem } from './Order_Menu_Item';
import { Restaurant } from './Restaurant';

@Entity({ name: 'menu_items' })
export class MenuItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    item_name: string;

    @Column()
    price: number;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu_items)
    restaurant: Restaurant;

    @OneToMany(() => OrderMenuItem, (order_menu_item) => order_menu_item.menu_item)
    order_menu_item: OrderMenuItem[];
}