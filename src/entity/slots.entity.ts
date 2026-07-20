import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { SlotsStatusEnum, ServiceTypeEnum } from "../enums/entity.enums";
import { DoctorSchedule } from "./doctorSchedule.entity";
import { Reservation } from "./reserve.entity";

@Entity("slots")
export class Slots {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: ServiceTypeEnum, nullable: false })
    service_type!: ServiceTypeEnum;

    @Column({ type: "datetime", nullable: false })
    startAt!: Date;

    @Column({ type: "datetime", nullable: false })
    endAt!: Date;

    @Column({ type: "enum", enum: SlotsStatusEnum, default: SlotsStatusEnum.Available, nullable: false })
    status!: SlotsStatusEnum;

    @ManyToOne(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.slots)
    doctorSchedule!: DoctorSchedule;    

    @ManyToOne(() => User, (user) => user.slots)
    user!: User;

    @OneToOne(() => Reservation, (reservation) => reservation.slot)
    reservation!: Reservation;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}