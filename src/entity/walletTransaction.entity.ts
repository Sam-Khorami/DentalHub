import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TransactionType { Deposit = "deposit", Withdraw = "withdraw", Purchase = "purchase", Refund = "refund", AdminDeposit = "adminDeposit", AdminWithdraw = "adminWithdraw" }
export enum TransactionStatus { Pending = "pending", Success = "success", Failed = "failed", Canceled = "canceled" }

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

}