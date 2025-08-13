import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from "typeorm";
import { Product } from "./Product.entity";

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn({ name: 'id_supplier' })
    idSupplier: number;

    @Column({ name: 'supplier_name' })
    supplierName: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @OneToMany(() => Product, product => product.supplier)
    products: Product[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
