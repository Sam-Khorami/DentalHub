import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import bcrypt from "bcrypt";
import { Profile } from "./profile.entity";
import { Requests } from "./request.entity";
import { DoctorSchedule } from "./doctorSchedule.entity";
import { Slots } from "./slots.entity";
import { UserRole } from "../enums/entity.enums";
import { Reservation } from "./reserve.entity";
import { Books } from "./book.entity";
import { Product } from "./product.entity";
import { Orders } from "./order.entity";
import { Comments } from "./comments.entity";

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    username!: string;

    @Column({ type: "varchar", nullable: false })
    email!: string;

    @Column({type: "varchar", nullable: false})
    password!: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.User })
    role!: UserRole | string;

    @Column({ type: "boolean", nullable: false, default: false })
    is_email_verified!: boolean;

    @Column({ type: "boolean", nullable: false, default: false })
    is_verified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToMany(() => Role, (roles) => roles)
    @JoinTable({ name: "user_role" })
    roles!: Role[];

    @ManyToMany(() => Permission, (permissions) => permissions)
    @JoinTable({name: "user_permission"})
    permissions!: Permission[];

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Profile;

    @OneToMany(() => Requests, (requests) => requests.user)
    requests!: Requests[];

    @OneToMany(() => DoctorSchedule, (doctorSchedules) => doctorSchedules.user)
    doctorSchedules!: DoctorSchedule[];

    @OneToMany(() => Slots, (slots) => slots.user)
    slots!: Slots[];

    @OneToMany(() => Reservation, (reservations) => reservations.patient)
    reservations!: Reservation[];

    @OneToMany(() => Books, (books) => books.patient)
    books!: Books[];

    @OneToMany(() => Orders, (orders) => orders.user)
    orders!: Orders[];

    @OneToMany(() => Comments, (comments) => comments.user)
    comments!: Comments[];

    @BeforeInsert()
    async hashPassword () {

        this.password = await bcrypt.hash(this.password, 12);

    }

}