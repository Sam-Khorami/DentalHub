import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";


@Entity("permission")
export class Permission {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", unique: true, nullable: false})
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
}