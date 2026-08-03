import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CurrencyEnum, WalletStatus } from "../enums/entity.enums";
import { WalletTransaction } from "./walletTransaction.entity";
import { User } from "./user.entity";


@Entity("wallet")
export class Wallet {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint", nullable: false, default: 0 })
    balance!: number;

    @Column({ type: "enum", enum: WalletStatus, nullable: false, default: WalletStatus.Active })
    status!: WalletStatus;

    @Column({ type: "enum", enum: CurrencyEnum, nullable: false, default: CurrencyEnum.IRT })
    currency!: CurrencyEnum;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => WalletTransaction, (transactions) => transactions.wallet)
    transactions!: WalletTransaction[];

    @OneToOne(() => User, (user) => user.wallet)
    user!: User;

}