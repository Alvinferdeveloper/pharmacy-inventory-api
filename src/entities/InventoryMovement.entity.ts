import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Product } from "./Product.entity";

export enum MovementType {
    IN = "in",
    OUT = "out",
}

@Entity('inventory_movements')
export class InventoryMovement {
    @PrimaryGeneratedColumn({ name: 'id_movement' })
    idMovement: number;

    @ManyToOne(() => Product, product => product.inventoryMovements)
    @JoinColumn({ name: 'id_product' })
    product: Product;

    @Column({
        type: 'enum',
        enum: MovementType,
        name: 'movement_type'
    })
    movementType: MovementType;

    @Column()
    quantity: number;

    @CreateDateColumn()
    date: Date;

    @Column()
    reason: string;
}
