import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permission.entity";


@Entity("role")
export class Role {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", unique: true, nullable: false})
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToMany(() => Permission, (permissions) => permissions)
    @JoinTable({name: "role_permission"})
    permissions!: Permission[];

}