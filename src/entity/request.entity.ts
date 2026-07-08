import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";


// beingDentalTechnician,beingDentalTherapist,beingDentist

export enum RequestStatus { Accepted = "accepted", Rejected = "rejected", Pending = "pending" }
export enum RequestEnum { 
    
    BeingDoctor = "beingDoctor",
    BeingClerk = "beingClerk",
    BeingOrthodonticTherapist = "beingOrthodonticTherapist",
    BeingDentalHygienist = "beingDentalHygienist",
    BeingDentalNurse = "beingDentalNurse",
    BeingDentalTechnician = "beingDentalTechnician",
    BeingDentalTherapist = "beingDentalTherapist",
    BeingDentist = "beingDentist"

}

@Entity("requests")
export class Requests {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: RequestEnum, nullable: false })
    request!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.Pending, nullable: false })
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.requests)
    user!: User;

}