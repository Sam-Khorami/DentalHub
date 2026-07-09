import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import bcrypt from "bcrypt";
import { Profile } from "./profile.entity";
import { Requests } from "./request.entity";

export enum UserRole { User = "user", SuperAdmin = "superAdmin", Admin = "admin", Clerk = "clerk", OrthodonticTherapist = "orthodonticTherapist", DentalHygienist = "dentalHygienist", DentalNurse = "dentalNurse", DentalTechnician = "dentalTechnician", DentalTherapist = "dentalTherapist", Dentist = "dentist" };

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

    @BeforeInsert()
    async hashPassword () {

        this.password = await bcrypt.hash(this.password, 12);

    }

}