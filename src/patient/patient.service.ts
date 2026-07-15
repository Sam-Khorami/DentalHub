import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { Repository } from 'typeorm';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { UserRole } from '../enums/entity.enums';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PatientService {

    constructor (
    
        @InjectRepository(User) private readonly userRepo: Repository<User>,
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

}
