import { Injectable } from "@nestjs/common";
import { DayOfWeekEnum, SlotsStatusEnum } from "../../enums/entity.enums";
import { Day, nextDay, startOfDay } from "date-fns";
import { InjectRepository } from "@nestjs/typeorm";
import { DoctorSchedule } from "../../entity/doctorSchedule.entity";
import { In, Repository } from "typeorm";
import { Slots } from "../../entity/slots.entity";

@Injectable()
export class ScheduleJob {

    constructor (

        @InjectRepository(DoctorSchedule) private readonly doctorScheduleRepo: Repository<DoctorSchedule>,
        @InjectRepository(Slots) private readonly slotsRepo: Repository<Slots>

    ) {}

    private dayStart (date: Date) {

        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;

    }
    
    private combineDateTime (date: Date, time: string) {

        const [ hour, minute, second = "0" ] = time.split(":");

        const result = new Date(date);
        result.setHours(Number(hour), Number(minute), Number(second), 0);

        return result;

    }

    private getNextWeekDate (dayOfWeek: DayOfWeekEnum) {

        const dayMap: Record<DayOfWeekEnum, Day> = {

            [DayOfWeekEnum.Sunday]: 0,
            [DayOfWeekEnum.Monday]: 1,
            [DayOfWeekEnum.Tuesday]: 2,
            [DayOfWeekEnum.Wednesday]: 3,
            [DayOfWeekEnum.Thursday]: 4,
            [DayOfWeekEnum.Friday]: 5,
            [DayOfWeekEnum.Saturday]: 6,

        }

        const next = nextDay(new Date(), dayMap[dayOfWeek]);
        return startOfDay(next);

    }

    async schedule () {

        console.log("Starting for Scheduling");

        // Getting the list of schedules
        const schedules = await this.doctorScheduleRepo.find({ where: { isActive: true }, relations: { user: true } });

        // Loop On Schedules
        for (const schedule of schedules) {

            // We will get the date of target day for future without time it will be 00:00:00 
            const targetDate = this.getNextWeekDate(schedule.dayOfWeek);
            
            // Getting the start time and end time according to schedule start time and end time
            const start = this.combineDateTime(targetDate, schedule.start_time!);
            const end = this.combineDateTime(targetDate, schedule.end_time!);
            
            // Checking the slot if it exists!
            const slotAlreadyExists = await this.slotsRepo.findOne({ where: { doctorSchedule: { id: schedule.id }, startAt: start } });
            if (slotAlreadyExists) continue;

            // Creating a new array with list of Slots & createing a new object from start
            const slots: Slots[] = [];
            let current = new Date(start);

            // Loop will start
            while (end > current) {

                // Createing a new object from current now we have got three diffrent object: start, current, slotEnd
                const slotEnd = new Date(current);

                // Calculating the slot duration and checking the end
                slotEnd.setMinutes(slotEnd.getMinutes() + schedule.slot_duration!);
                if (slotEnd > end) break;

                slots.push(
                
                    this.slotsRepo.create({ 
                        
                        service_type: schedule.service_type, 
                        startAt: new Date(current), 
                        endAt: new Date(slotEnd),
                        doctorSchedule: schedule,
                        user: schedule.user 
                        
                    })
                
                );

                current = slotEnd;

            }

            await this.slotsRepo.save(slots);

        }

    }

    async clearSchedule () {

        console.log("Starting For Clearing Useless Schedules");
        const slots = await this.slotsRepo.find({ where: { status: In([SlotsStatusEnum.Booked, SlotsStatusEnum.Cancelled, SlotsStatusEnum.Completed, SlotsStatusEnum.Reserved]) } });
        if(!slots) return;

        await this.slotsRepo.remove(slots);
        return;

    }

}