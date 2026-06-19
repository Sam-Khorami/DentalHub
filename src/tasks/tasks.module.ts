import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CleanUp } from './jobs/cleanUp.job';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../entity/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [TasksService, CleanUp]
})
export class TasksModule {}
