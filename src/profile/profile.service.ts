import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { Express } from "express";

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


    async uploadProfile (image: Express.Multer.File, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { profile: true }});
        if (!user) throw new NotFoundException("User Not Found!");

        const profile = await this.profileRepo.findOne({ where: { user: { id: userId } } });
        if (!profile) throw new NotFoundException("Profile Not Found!");

        profile.avatar = null;
        profile.avatar = `http://localhost:${process.env.HOST_POST}/uploads/${image.filename}`;
        await this.profileRepo.save(profile);

        return;

    }

    async uploadLicence (licence: Express.Multer.File, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { profile: true } });
        if (!user) throw new NotFoundException("User Not Found!");

        const profile = await this.profileRepo.findOne({ where: { user: { id: userId } } });
        if (!profile) throw new NotFoundException("Profile Not Found!");
        if (profile.licences === null) profile.licences = [];

        const path = `http://localhost:${process.env.HOST_POST}/uploads/${licence.filename}`;
        const checkProfile = profile.licences.includes(path);
        if (checkProfile) throw new ConflictException("Licence Already Uploaded");

        profile.licences.push(path);
        await this.profileRepo.save(profile);
        return;

    }

    async uploadPortfolio (portfolio: Express.Multer.File, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { profile: true } });
        if (!user) throw new NotFoundException("User Not Found!");

        const profile = await this.profileRepo.findOne({ where: { user: { id: userId } } });
        if (!profile) throw new NotFoundException("Profile Not Found!");
        if (profile.portfolios === null) profile.portfolios = [];

        const path = `http://localhost:${process.env.HOST_POST}/uploads/${portfolio.filename}`;
        const checkProfile = profile.portfolios.includes(path);
        if (checkProfile) throw new ConflictException("Portfolio Already Uploaded");

        profile.portfolios.push(path);
        await this.profileRepo.save(profile);
        return;

    }


}
