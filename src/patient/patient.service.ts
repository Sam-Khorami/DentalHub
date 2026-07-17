import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
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

    private getTargetDate (requestedDay: number) {

        const today = new Date();
        const jsDay = today.getDay();

        const currentDay = (jsDay + 1) % 7;
        let diffrence = requestedDay - currentDay;
        if (diffrence < 0) diffrence += 7;

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diffrence);

        return targetDate;
    }

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

        if (day === DayOfWeekEnum.Friday) throw new BadRequestException("Clinic is closed for this day");

        const now = new Date();
        const dayMap = {
            [DayOfWeekEnum.Saturday]: 0,
            [DayOfWeekEnum.Sunday]: 1,
            [DayOfWeekEnum.Monday]: 2,
            [DayOfWeekEnum.Tuesday]: 3,
            [DayOfWeekEnum.Wednesday]: 4,
            [DayOfWeekEnum.Thursday]: 5,
            [DayOfWeekEnum.Friday]: 6,
        }

        const requestedDay = dayMap[day];
        const targetDate = this.getTargetDate(requestedDay);

        const startOfTargetDay = new Date(targetDate);
        startOfTargetDay.setHours(0, 0, 0, 0);

        const endOfTargetDay = new Date(targetDate);
        endOfTargetDay.setHours(23, 59, 59, 999);

        if (endOfTargetDay < now) throw new BadRequestException("You can not view appointments for past days");

        const isToday = startOfTargetDay.toDateString() === now.toDateString();
        const filterFrom = isToday ? now : startOfTargetDay;

        const slotsFromDb = await this.slotsRepo.find({
            
            where: {
                status: SlotsStatusEnum.Available,
                doctorSchedule: { dayOfWeek: day },
                startAt: MoreThanOrEqual(filterFrom)
            },
            relations: { user: true },
            select: { id: true, service_type: true, startAt: true, endAt: true, user: { username: true, role: true }}
        
        });

    return slotsFromDb;

    }

}
