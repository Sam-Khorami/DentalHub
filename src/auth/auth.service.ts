import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import { MailService } from '../mail/mail.service';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { OtpVerificationDto } from './dto/otpVerification.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from "bcrypt";
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
        private readonly redisService: RedisService,
        private mailService: MailService,
        private jwtService: JwtService

    ) {}

    async signup (data: SigninDto) {

        // Checking Confilict Exception
        const user = await this.userRepo.findOne({ where: { username: data.username } });
        if (user) throw new ConflictException("User already exists!");

        // Getting Role & Generate New User
        const role = await this.roleRepo.findOne({ where: { name: "user" } });
        const newUser = this.userRepo.create({ username: data.username, email: data.email, password: data.password, roles: [role!] });
        await this.userRepo.save(newUser);

        // Generate Otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Sending Otp And Set it up in redis
        await this.redisService.setOtp(`otp:${data.username}`, otp, 120000);
        await this.mailService.sendOtp(data.email, otp);

        return;

    }

    async login (data: LoginDto, request: Request) {

        // User Existing Check And Checking It's Verification
        const user = await this.userRepo.findOne({ where: { username: data.username } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (!user.is_email_verified) throw new BadRequestException("User needs to signup again!");

        // Password Checking
        const hashedPassword = user.password;
        const checkPassword = await bcrypt.compare(data.password, hashedPassword);
        if (!checkPassword) throw new BadRequestException("Username or Password are wrong!");

        // Generate Otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Sending Otp Code To Email And Set it up in redis
        await this.redisService.setOtp(`otp:${data.username}`, otp, 120000);
        this.mailService.sendOtp(user.email, otp);
        return;
        
    }

    async logout (request: Request) {

        // Checking User Existing And Check It's Verification
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (!user.is_verified) throw new BadRequestException("User is already logout!");

        // Logging Out User
        user.is_verified = false;
        await this.userRepo.save(user);

        return;

    }

    async otpVerification (data: OtpVerificationDto) {

        // Checking User Exsiting
        const user = await this.userRepo.findOne({ where: { username: data.username }, relations: { roles: true } });
        if (!user) throw new NotFoundException("User Not Found!");

        // Checking Otp Exsiting & Expiration
        const otp: string | unknown = await this.redisService.get(`otp:${data.username}`);
        if (!otp) throw new BadRequestException("Otp is expired!!");
        if (data.otp !== otp) throw new BadRequestException("Your entered otp does not match!"); 

        // Generate Token & Change Tables Datas
        const token = this.jwtService.sign({ username: user.username, userId: user.id, role: user.role });
        user.is_email_verified = true
        user.is_verified = true;
        await this.userRepo.save(user);

        // Returning Token
        return token;

    }

    async getPermissions (userId: number) {

        const permissions = new Set<string>();

        // Finding User And Add thier permissions
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { roles: { permissions: true }, permissions: true } });
        user?.permissions.forEach((val) => {

            permissions.add(val.name);

        });

        user?.roles.forEach((val) => {

            val.permissions.forEach((value) => {

                permissions.add(value.name);

            });

        })

        // Returing The Array Insted Of Object
        return Array.from(permissions);

    }

}
