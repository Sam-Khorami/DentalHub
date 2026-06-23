import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Injectable()
export class ProfileService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>

    ) {}

    async completeProfile (data: CompleteProfileDto, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { profile: true } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (user.profile) throw new BadRequestException("User profile created already!");

        const newProfile = this.profileRepo.create({ firstName: data.firstName, lastName: data.lastName, birthDate: data.birthDate, user: user });
        console.log(newProfile);
        await this.profileRepo.save(newProfile);
        return;

    }

    async updateProfile (data: UpdateProfileDto, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        await this.profileRepo.update({ user }, data);
        return;

    }

}
