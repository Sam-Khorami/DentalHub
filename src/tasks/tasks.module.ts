import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { Slots } from '../entity/slots.entity';
import { ScheduleJob } from './jobs/schedule.job';

@Module({
  imports: [TypeOrmModule.forFeature([User, DoctorSchedule, Slots])],
  providers: [TasksService, ScheduleJob]
})
export class TasksModule {}
