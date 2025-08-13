import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Category } from "./Category.entity";
import { Supplier } from "./Supplier.entity";
import { InvoiceDetail } from "./InvoiceDetail.entity";
import { InventoryMovement } from "./InventoryMovement.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn({ name: 'id_product' })
    idProduct: number;

    @Column({ unique: true })
    code: string;

    @Column({ name: 'product_name' })
    productName: string;

    @Column()
    description: string;

    @Column('decimal', { name: 'purchase_price', precision: 10, scale: 2 })
    purchasePrice: number;

    @Column('decimal', { name: 'selling_price', precision: 10, scale: 2 })
    sellingPrice: number;

    @Column()
    stock: number;

    @Column({ name: 'expiration_date', type: 'date' })
    expirationDate: Date;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'id_category' })
    category: Category;

    @ManyToOne(() => Supplier, supplier => supplier.products)
    @JoinColumn({ name: 'id_supplier' })
    supplier: Supplier;

    @OneToMany(() => InvoiceDetail, invoiceDetail => invoiceDetail.product)
    invoiceDetails: InvoiceDetail[];

    @OneToMany(() => InventoryMovement, inventoryMovement => inventoryMovement.product)
    inventoryMovements: InventoryMovement[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
