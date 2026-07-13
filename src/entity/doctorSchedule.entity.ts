import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Slots } from "./slots.entity";
import { DayOfWeekEnum, ServiceTypeEnum } from "../enums/entity.enums";

@Entity("doctor_schedule")
export class DoctorSchedule {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: DayOfWeekEnum, nullable: false })
    dayOfWeek!: DayOfWeekEnum;

    @Column({ type: "time", nullable: true })
    start_time!: string | null;

    @Column({ type: "time", nullable: true })
    end_time!: string | null;

    @Column({ type: "int", nullable: true })
    slot_duration!: number | null;

    @Column({ type: "enum", enum: ServiceTypeEnum, nullable: false })
    service_type!: ServiceTypeEnum;

    @Column({ type: "boolean", nullable: false, default: true })
    isActive!: boolean;

    @OneToMany(() => Slots, (slots) => slots.doctorSchedule)
    slots!: Slots[];

    @ManyToOne(() => User, (user) => user.doctorSchedules)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}