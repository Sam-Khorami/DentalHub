import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";
import { Comments } from "./comments.entity";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    name!: string;

    @Column({ type: "int", nullable: false })
    quantity!: number;

    @Column({ type: "bigint", nullable: false })
    price!: number;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Category, (category) => category.products)
    category!: Category;

    @OneToMany(() => Comments, (comments) => comments.product)
    comments!: Comments[];

}