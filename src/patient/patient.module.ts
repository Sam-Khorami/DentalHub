import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, Requests]),
    MailModule,
    AuthModule
  
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
