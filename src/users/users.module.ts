import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../entity/role.entity';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([User, Role]),
    AuthModule
  
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
