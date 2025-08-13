import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
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
}
