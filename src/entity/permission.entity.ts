import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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