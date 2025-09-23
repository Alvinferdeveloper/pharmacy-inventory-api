import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, DeleteDateColumn } from "typeorm";
import { Role } from "./Role.entity";
import { Invoice } from "./Invoice.entity";
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    idUser: number;

    @Column()
    name: string;

    @Column()
    identification: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'id_role' })
    role: Role;

    @Column({ name: 'must_change_password', default: true })
    mustChangePassword: boolean;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Invoice, invoice => invoice.user)
    invoices: Invoice[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}