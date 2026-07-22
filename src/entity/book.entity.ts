import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Slots } from "./slots.entity";

@Entity("books")
export class Books {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.books)
    patient!: User;

    @OneToOne(() => Slots, (slot) => slot.book)
    @JoinColumn()
    slot!: Slots;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}