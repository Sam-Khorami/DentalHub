import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { Slots } from '../entity/slots.entity';
import { ScheduleJob } from './jobs/schedule.job';
import { MailModule } from '../mail/mail.module';
import { Reservation } from '../entity/reserve.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, DoctorSchedule, Slots, Reservation]),
    MailModule

  ],
  providers: [TasksService, ScheduleJob]
})
export class TasksModule {}
