import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


@Entity("otp")
export class Otp {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: false })
    otp!: string;

    @Column({ type: "date", nullable: false })
    expiresAt!: Date;

    @Column({ type: "boolean", nullable: false, default: false })
    isExpired!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @ManyToOne(() => User, (user) => user.otps)
    user!: User;

}