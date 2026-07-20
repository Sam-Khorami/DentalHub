import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Slots } from "./slots.entity";

@Entity("reservations")
export class Reservation {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.reservations)
    patient!: User;

    @OneToOne(() => Slots, (slot) => slot.reservation)
    @JoinColumn()
    slot!: Slots;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}