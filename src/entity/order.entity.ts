import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum OrderStatusEnum { Pending = "pending", Payed = "payed", Canceled = "canceled" }

@Entity("orders")
export class Orders {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.Pending })
    status!: OrderStatusEnum;

    @Column({ type: "bigint", nullable: false })
    totalPrice!: number;

    @Column({ type: "timestamp", nullable: true })
    payedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user!: User;

}