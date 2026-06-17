import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import { MailService } from '../mail/mail.service';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { Otp } from '../entity/otp.entity';
import { OtpVerificationDto } from './dto/otpVerification.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
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

        // Generate Otp And Save It
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtp = this.otpRepo.create({ otp, user: newUser, expiresAt: new Date(Date.now() + 2 * 60 * 1000) });
        await this.otpRepo.save(newOtp);

        // Sending Otp
        this.mailService.sendOtp(data.email, otp);

        return;

    }

    async otpVerification (data: OtpVerificationDto) {

        // Checking User Exsiting
        const user = await this.userRepo.findOne({ where: { username: data.username }, relations: { roles: true } });
        if (!user) throw new NotFoundException("User Not Found!");

        // Checking User Verification
        if (user.is_verified) throw new BadRequestException("User is verified already!");

        // Checking Otp Exsiting
        const otp = await this.otpRepo.findOne({ where: { user: { username: data.username }, otp: data.otp } });
        if (!otp) throw new NotFoundException("Otp Not Found!");

        // Checing Otp Expiration
        if (otp.isExpired) throw new BadRequestException("Otp is expired!!");
        if (new Date(Date.now()) > otp.expiresAt) throw new BadRequestException("Otp is expired!");

        // Generate Token & Change Tables Datas
        const token = this.jwtService.sign({ username: user.username, userId: user.id, role: user.role });
        user.is_verified = true;
        otp.isExpired = true;

        await this.userRepo.save(user);
        await this.otpRepo.save(otp);

        // Returning Token
        return token;

    }

}
