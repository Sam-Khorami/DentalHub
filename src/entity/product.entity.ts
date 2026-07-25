import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Category, (category) => category.products)
    category!: Category;

}