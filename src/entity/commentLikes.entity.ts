import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from "./comments.entity";
import { User } from "./user.entity";


@Entity("comment_likes")
export class CommentLikes {

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Comments, (comments) => comments.likes)
    comment!: Comments;

    @ManyToOne(() => User, (user) => user.likes)
    user!: User;

}