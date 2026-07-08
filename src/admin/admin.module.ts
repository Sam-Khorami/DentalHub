import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, Requests]),
    MailModule
  
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
