import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./Role.entity";
import { Invoice } from "./Invoice.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    idUser: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'id_role' })
    role: Role;

    @OneToMany(() => Invoice, invoice => invoice.user)
    invoices: Invoice[];
}
