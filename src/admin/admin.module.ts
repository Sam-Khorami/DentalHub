import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Requests } from '../entity/request.entity';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../entity/role.entity';
import { Category } from '../entity/category.entity';
import { Product } from '../entity/product.entity';
import { Comments } from '../entity/comments.entity';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, Requests, Role, Category, Product, Comments]),
    AuthModule,
    MailModule
  
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
