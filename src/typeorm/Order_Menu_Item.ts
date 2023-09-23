import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MenuItem } from './Menu_Item';

@Entity({ name: 'order_menu_items' })
export class OrderMenuItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column() // Change to many to one
    order_id: Date; 

    @Column()
    quantity_ordered: number;

    @ManyToOne(() => MenuItem, (menu_item) => menu_item.order_menu_item)
    menu_item: MenuItem;
}