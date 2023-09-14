import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}