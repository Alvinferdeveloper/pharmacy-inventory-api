import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from "typeorm";
import { Invoice } from "./Invoice.entity";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn({ name: 'id_customer' })
    idCustomer: number;

    @Column({ name: 'customer_name' })
    customerName: string;

    @Column({ nullable: true })
    identification: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @OneToMany(() => Invoice, invoice => invoice.customer)
    invoices: Invoice[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
