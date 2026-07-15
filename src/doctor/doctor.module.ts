import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule } from '../entity/doctorSchedule.entity';
import { User } from '../entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Slots } from '../entity/slots.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, DoctorSchedule, Slots]),
    AuthModule,
    MailModule
  
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
