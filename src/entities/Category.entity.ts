import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from "typeorm";
import { Product } from "./Product.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn({ name: 'id_category' })
    idCategory: number;

    @Column({ name: 'category_name' })
    categoryName: string;

    @Column()
    description: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}
