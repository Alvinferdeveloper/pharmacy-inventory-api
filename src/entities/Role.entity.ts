import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from "typeorm";
import { User } from "./User.entity";

export enum RoleName {
    ADMINISTRATOR = "Administrator",
    SALESMAN = "Salesman",
    CONSULTANT = "Consultant",
}

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn({ name: 'id_role' })
    idRole: number;

    @Column({
        type: 'enum',
        enum: RoleName,
        name: 'role_name',
    })
    roleName: RoleName;

    @Column()
    description: string;

    @OneToMany(() => User, user => user.role)
    users: User[];

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date;
}