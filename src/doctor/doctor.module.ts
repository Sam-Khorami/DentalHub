import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { User } from '../entity/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, DoctorSchedule]),
    AuthModule
  
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
