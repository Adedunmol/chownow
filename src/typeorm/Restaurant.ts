import { Role } from '../utils/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { Address } from './Address';
import { FoodOrder } from './Food_Order';
import { MenuItem } from './Menu_Item';

@Entity({ name: 'restaurants' })
export class Restaurant {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    restaurant_name: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.RESTAURANT
    })
    role: Role;

    @Column()
    password: string;

    @CreateDateColumn()
    date_joined: Date;

    @ManyToOne(() => Address, (address) => address.restaurant)
    address: Address;

    @OneToMany(() => FoodOrder, (food) => food.customer)
    food_orders: FoodOrder[]

    @OneToMany(() => MenuItem, (menu_item) => menu_item.restaurant)
    menu_items: MenuItem[]
}