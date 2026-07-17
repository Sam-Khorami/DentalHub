import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { Repository } from 'typeorm';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { DayOfWeekEnum, SlotsStatusEnum, UserRole } from '../enums/entity.enums';
import { MailService } from '../mail/mail.service';
import { Slots } from '../entity/slots.entity';

@Injectable()
export class PatientService {

    constructor (
    
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Requests) private readonly requestsRepo: Repository<Requests>,
        @InjectRepository(Slots) private readonly slotsRepo: Repository<Slots>,
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

    async availableAppointments (day: DayOfWeekEnum) {

        // Getting Date & Time
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        // Combining Date And Time
        const [ hour, minute, second = "0" ] = time.split(":");
        const result = new Date(date);
        result.setHours(Number(hour), Number(minute), Number(second), 0);

        const dayMap = {

            [DayOfWeekEnum.Sunday]: 0,
            [DayOfWeekEnum.Monday]: 1,
            [DayOfWeekEnum.Tuesday]: 2,
            [DayOfWeekEnum.Wednesday]: 3,
            [DayOfWeekEnum.Thursday]: 4,
            [DayOfWeekEnum.Friday]: 5,
            [DayOfWeekEnum.Saturday]: 6,

        }

        // It Checks That The Entered Date Is Not Earlier Than Today And Not To be Friday
        const dayNumber = dayMap[day];
        if (dayNumber < date.getDay()) throw new BadRequestException("You need to send today's day or for future");
        if (day === DayOfWeekEnum.Friday) throw new BadRequestException("Clinic is closed for this day");

        // Finding Slot Which They Are Available And Have A Target Day
        const slots: Slots[] = [];
        const slotsFromDb = await this.slotsRepo.find({ where: { status: SlotsStatusEnum.Available, doctorSchedule: { dayOfWeek: day } }, relations: { user: true }, select: { id: true, service_type: true, startAt: true, endAt: true, status: true, user: { username: true } } });

        slotsFromDb.forEach((slot) => {

            if (slot.startAt > result) slots.push(slot);

        });

        return slots;

    }

}
