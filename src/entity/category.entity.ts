import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("category")
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Product, (products) => products.category)
    products!: Product[];

}