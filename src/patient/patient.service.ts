import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { Between, In, MoreThanOrEqual, Repository } from 'typeorm';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { DayOfWeekEnum, SlotsStatusEnum, UserRole } from '../enums/entity.enums';
import { MailService } from '../mail/mail.service';
import { Slots } from '../entity/slots.entity';
import { AvailableAppointmentsDto } from './dto/availableAppointments.dto';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { Reservation } from '../entity/reserve.entity';
import { Books } from '../entity/book.entity';

@Injectable()
export class PatientService {

    constructor (
    
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Requests) private readonly requestsRepo: Repository<Requests>,
        @InjectRepository(Slots) private readonly slotsRepo: Repository<Slots>,
        @InjectRepository(DoctorSchedule) private readonly doctorScheduleRepo: Repository<DoctorSchedule>,
        @InjectRepository(Reservation) private readonly reservationRepo: Repository<Reservation>,
        @InjectRepository(Books) private readonly booksRepo: Repository<Books>,
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

    async availableAppointments (query: AvailableAppointmentsDto) {

        if (query.day && query.day === DayOfWeekEnum.Friday) throw new BadRequestException("Clinic is closed for this day");
        if (query.doctorId) {

            const roles: UserRole[] = [UserRole.Dentist, UserRole.OrthodonticTherapist, UserRole.DentalHygienist, UserRole.DentalNurse, UserRole.DentalTherapist];

            const doctor = await this.doctorScheduleRepo.findOne({ where: { user: { id: query.doctorId } }, relations: { user: true } });
            if (!doctor) throw new NotFoundException("User Not Found!");
            if (!roles.includes(doctor.user.role as UserRole)) throw new BadRequestException("The entered docterId is not clinic staff");

        }

        const now = new Date();
        let filterFrom = now;

        if (query.day) {
            const dayMap = {
                [DayOfWeekEnum.Saturday]: 0,
                [DayOfWeekEnum.Sunday]: 1,
                [DayOfWeekEnum.Monday]: 2,
                [DayOfWeekEnum.Tuesday]: 3,
                [DayOfWeekEnum.Wednesday]: 4,
                [DayOfWeekEnum.Thursday]: 5,
                [DayOfWeekEnum.Friday]: 6,
            }

            const requestedDay = dayMap[query.day!];
            const targetDate = this.getTargetDate(requestedDay);

            const startOfTargetDay = new Date(targetDate);
            startOfTargetDay.setHours(0, 0, 0, 0);

            const endOfTargetDay = new Date(targetDate);
            endOfTargetDay.setHours(23, 59, 59, 999);

            if (endOfTargetDay < now) throw new BadRequestException("You can not view appointments for past days");

            const isToday = startOfTargetDay.toDateString() === now.toDateString();
            filterFrom = isToday ? now : startOfTargetDay;
        
        }

        const slotsFromDb = await this.slotsRepo.find({
            
            where: {
                status: SlotsStatusEnum.Available,
                startAt: MoreThanOrEqual(filterFrom),
                ...(query.serviceType && { service_type: query.serviceType }),
                ...((query.day || query.doctorId) && {
                    
                    doctorSchedule: {
                
                        ...(query.day && { dayOfWeek: query.day }),            
                        ...(query.doctorId && { user: { id: query.doctorId } }),
            
                    }
    
                })
    
            },
            relations: { user: true },
            select: { id: true, service_type: true, startAt: true, endAt: true, user: { username: true, role: true }}    

        });

        return slotsFromDb;

    }

    async reserveAppointment (slotId: number, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const slot = await this.slotsRepo.findOne({ where: { id: slotId, status: SlotsStatusEnum.Available }, relations: { user: true, doctorSchedule: true } });
        if (!slot) throw new NotFoundException("Slot Not Found!");
        
        const slotDay = slot.doctorSchedule.dayOfWeek;
        const checkSlot = await this.slotsRepo.findOne({ where: { doctorSchedule: { dayOfWeek: slotDay }, reservation: { patient: { id: userId } } } });
        if (checkSlot) throw new BadRequestException("You can not reserve any appointment for today");

        const newReservation = this.reservationRepo.create({ slot, patient: user });
        await this.reservationRepo.save(newReservation);
        slot.status = SlotsStatusEnum.Reserved;
        await this.slotsRepo.save(slot);
        
        const clerks: string[] = [];
        const targetClerks = await this.userRepo.find({ where: { role: UserRole.Clerk } });
        targetClerks.forEach((clerk) => clerks.push(clerk.email));
        
        const monthName = slot.startAt.toLocaleString("en-US", { month: "long" });
        await this.mailService.sendEmailToClerks(clerks, `Hi dear clerk the appointment was reserved by ${slot.user.username} for ${monthName} ${slot.startAt.getDate()} between ${slot.startAt.getHours()}:${slot.startAt.getMinutes()} and ${slot.endAt.getHours()}:${slot.endAt.getMinutes()}`);
        
        return;

    }

    async bookAppointment (slotId: number, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const slot = await this.slotsRepo.findOne({ where: { id: slotId, status: In([SlotsStatusEnum.Available, SlotsStatusEnum.Reserved]) }, relations: { doctorSchedule: true, book: { patient: true }, user: true } });
        if (!slot) throw new NotFoundException("Slot Not Found!");
        if (slot.status === SlotsStatusEnum.Reserved) {

            const patientIdSlot = slot.book.patient.id;
            if (patientIdSlot !== userId) throw new BadRequestException("You can not Book this Appointment");

        }

        const startOfSlotDay = new Date(slot.startAt);
        startOfSlotDay.setHours(0, 0, 0, 0);   

        const endOfSlotDay = new Date(slot.startAt);
        endOfSlotDay.setHours(23, 59, 59, 999);

        const books = await this.booksRepo.find({ where: { patient: { id: userId } }, relations: { slot: true } });
        const checkSlot = books.find((book) => {

            const start = book.slot.startAt;
            return ( start >= startOfSlotDay && start <= endOfSlotDay );

        });

        if (checkSlot) throw new BadRequestException("You can not book any appointment for this day");

        slot.status = SlotsStatusEnum.Booked;
        await this.slotsRepo.save(slot);
        const newbook = this.booksRepo.create({ patient: { id: userId }, slot: { id: slotId } });
        await this.booksRepo.save(newbook);

        const clerks: string[] = [];
        const targetClerks = await this.userRepo.find({ where: { role: UserRole.Clerk } });
        targetClerks.forEach((clerk) => clerks.push(clerk.email));

        const monthName = slot.startAt.toLocaleString("en-US", { month: "long" });
        await this.mailService.sendEmailToClerks(clerks, `Hi dear clerk the appointment was booked by ${slot.user.username} for ${monthName} ${slot.startAt.getDate()} between ${slot.startAt.getHours()}:${slot.startAt.getMinutes()} and ${slot.endAt.getHours()}:${slot.endAt.getMinutes()}`);

        return;

    }

    async getReservedAppointments (request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const appointments = await this.reservationRepo.find({ where: { patient: { id: userId } }, relations: { slot: true } });
        return appointments;

    }

    async getBookedAppointments (request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const appointments = await this.booksRepo.find({ where: { patient: { id: userId } }, relations: { slot: true } });
        return appointments;

    }

}
