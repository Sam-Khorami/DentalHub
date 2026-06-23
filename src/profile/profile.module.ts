import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Profile } from '../entity/profile.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([User, Profile]),
    AuthModule
  
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
