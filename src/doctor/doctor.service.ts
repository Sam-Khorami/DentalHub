import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { SetScheduleDto } from './dto/setSchedule.dto';

@Injectable()
export class DoctorService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(DoctorSchedule) private readonly doctorScheduleRepo: Repository<DoctorSchedule>

    ) {}


    async setSchedule (data: SetScheduleDto, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found");

        const checkSchedule = await this.doctorScheduleRepo.find({ where: { isActive: true, dayOfWeek: data.dayOfWeek, user: { id: userId } } });
        if (checkSchedule) {

            for (const schedule of checkSchedule) {

                if ((data.start_time < schedule.end_time! && data.end_time > schedule.start_time!) || (data.start_time === schedule.start_time && data.end_time === schedule.end_time)) throw new ConflictException("Conflict With schedule");

            }

        }

        const newSchedule = this.doctorScheduleRepo.create({ dayOfWeek: data.dayOfWeek, start_time: data.start_time, end_time: data.end_time, isActive: data.isActive, service_type: data.service_type, slot_duration: data.slot_duration, user: user })
        await this.doctorScheduleRepo.save(newSchedule);

        return;

    }


    async getSchedules (request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const schedules = await this.doctorScheduleRepo.find({ where: { user: { id: userId } } });
        if (!schedules) throw new NotFoundException("Schedules Not Found!");

        return schedules;

    }


    async getSchedule (scheduleId: number, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const schedule = await this.doctorScheduleRepo.findOne({ where: { user: { id: userId }, id: scheduleId } });
        if (!schedule) throw new NotFoundException("Schedule Not Found!");

        return schedule;

    }

}
