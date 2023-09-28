import { Role } from '../utils/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';
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

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @CreateDateColumn()
    date_joined: Date;

    @OneToMany(() => FoodOrder, (food) => food.customer)
    food_orders: FoodOrder[];

    @OneToMany(() => CustomerAddress, (customer_address) => customer_address.customer)
    customer_address: CustomerAddress;

    @BeforeInsert()
    addAdminRole() {
        if (this.username === 'Admin') this.role = Role.ADMIN;
    }
}