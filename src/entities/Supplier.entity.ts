import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
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
}
