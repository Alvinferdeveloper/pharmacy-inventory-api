import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { Customer } from "./Customer.entity";
import { User } from "./User.entity";
import { InvoiceDetail } from "./InvoiceDetail.entity";

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn({ name: 'id_invoice' })
    idInvoice: number;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Customer, customer => customer.invoices)
    @JoinColumn({ name: 'id_customer' })
    customer: Customer;

    @ManyToOne(() => User, user => user.invoices)
    @JoinColumn({ name: 'id_user' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2 })
    tax: number;

    @Column('decimal', { precision: 10, scale: 2 })
    discount: number;

    @OneToMany(() => InvoiceDetail, invoiceDetail => invoiceDetail.invoice, { cascade: true })
    invoiceDetails: InvoiceDetail[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
