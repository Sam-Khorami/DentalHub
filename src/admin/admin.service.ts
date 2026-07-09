import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Requests, RequestStatus } from '../entity/request.entity';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { MailService } from '../mail/mail.service';
import { Role } from '../entity/role.entity';

@Injectable()
export class AdminService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Requests) private readonly requestsRepo: Repository<Requests>,
        private readonly mailService: MailService

    ) {}

    async requestToAdmin (data: RequestToAdminDto, request: Request) {

        // Getting the request sender
        let superAdmins: string[] = [];
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (user.role !== UserRole.User) throw new BadRequestException("You do not have any access for this operation");
        
        // Check if the request already exists
        const checkRequestTable = await this.requestsRepo.findOne({ where: { user: { id: userId } } });
        if (checkRequestTable) throw new BadRequestException("You sent this request already!");

        // Generating new request
        const newRequest = this.requestsRepo.create({ request: data.request, description: data.description, user });
        await this.requestsRepo.save(newRequest);

        // Getting Super admins from database
        const getSuperAdmins = await this.userRepo.find({ where: { role: UserRole.SuperAdmin } });
        getSuperAdmins.forEach((superAdmin) => { superAdmins.push(superAdmin.email) });

        // Sending email to super admins
        await this.mailService.sendEmailToAdmins(superAdmins, `Hi dear super admin the ${user.username} sent this request to you for ${data.request} please check ${user.username}s request`);

        return;

    }

    async getPendingRequests () {

        const requests = await this.requestsRepo.find({ where: { status: RequestStatus.Pending }, relations: { user: true } });
        if (!requests) throw new NotFoundException("Requests Not Found!");

        return requests;

    }

    async getRequests () {

        const requests = await this.requestsRepo.find({ relations: { user: true } });
        if (!requests) throw new NotFoundException("Requests Not Found!");

        return requests;

    }

    async acceptRequest (userId: number, role: UserRole) {

        // Checking User Existing
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { roles: true } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (user.role !== UserRole.User) throw new BadRequestException("You do not have any access for this operation");

        // Checking User Request 
        const checkRequest = await this.requestsRepo.findOne({ where: { user: { id: userId } } });
        if (!checkRequest || checkRequest.status !== RequestStatus.Pending) throw new BadRequestException("The request for this user does not exists!");

        // Chcking Role Existing
        const checkRole = await this.roleRepo.findOne({ where: { name: role } });
        if (!checkRole) throw new NotFoundException("Role Not Found!");

        // Changing User Table
        user.roles.pop();
        user.role = checkRole.name;
        user.roles.push(checkRole);
        checkRequest.status = RequestStatus.Accepted;
        await this.userRepo.save(user);
        await this.requestsRepo.save(checkRequest);
        return;

    }


}
