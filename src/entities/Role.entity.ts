import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
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
}