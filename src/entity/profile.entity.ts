import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


@Entity("profile")
export class Profile {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", nullable: false})
    firstName!: string;

    @Column({type: "varchar", nullable: false})
    lastName!: string;

    @Column({type: "date", nullable: false})
    birthDate!: Date;

    @Column({type: "varchar", nullable: true})
    avatar!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user!: User;

}