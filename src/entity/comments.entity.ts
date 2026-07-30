import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { CommentLikes } from "./commentLikes.entity";

@Entity("comments")
export class Comments {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    title!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.comments)
    user!: User;

    @ManyToOne(() => Product, (product) => product.comments)
    product!: Product;

    @OneToMany(() => CommentLikes, (likes) => likes.comment)
    likes!: CommentLikes[];

}