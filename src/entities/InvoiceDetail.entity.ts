import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { Invoice } from "./Invoice.entity";
import { Product } from "./Product.entity";

@Entity('invoice_details')
export class InvoiceDetail {
    @PrimaryGeneratedColumn({ name: 'id_detail' })
    idDetail: number;

    @ManyToOne(() => Invoice, invoice => invoice.invoiceDetails)
    @JoinColumn({ name: 'id_invoice' })
    invoice: Invoice;

    @ManyToOne(() => Product, product => product.invoiceDetails)
    @JoinColumn({ name: 'id_product' })
    product: Product;

    @Column()
    quantity: number;

    @Column('decimal', { name: 'unit_price', precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
