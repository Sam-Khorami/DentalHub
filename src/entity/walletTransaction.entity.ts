import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Wallet } from "./wallet.entity";
import { TransactionType, TransactionStatus } from "../enums/entity.enums";


@Entity("wallet_transaction")
export class WalletTransaction {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: TransactionType, nullable: false })
    type!: TransactionType;

    @Column({ type: "enum", enum: TransactionStatus, default: TransactionStatus.Success })
    status!: TransactionStatus;

    @Column({ type: "bigint", nullable: false })
    amount!: number;

    @Column({ type: "bigint", nullable: false })
    balanceBefore!: number;

    @Column({ type: "bigint", nullable: false })
    balanceAfter!: number;

    @Column({ type: "text", nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet!: Wallet;

}