import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { Role } from '../entity/role.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>

    ) {}

    async getUsers () {

        const users = await this.userRepo.find();
        if (!users) throw new NotFoundException("Users Not Found!");

        return users;

    }

    async createUser (data: CreateUserDto) {

        let role: UserRole.User | UserRole = UserRole.User;

        const user = await this.userRepo.findOne({ where: { username: data.username } });
        if (user) throw new ConflictException("User already exists");

        if (data.role) role = data.role;

        const userRole = await this.roleRepo.findOne({ where: { name: role } });
        if (!userRole) throw new NotFoundException("Role Not Found!");

        const newUser = this.userRepo.create({ username: data.username, email: data.email, password: data.password, roles: [userRole], role: role });
        await this.userRepo.save(newUser);

        return;

    }

    async updateUser (userId: number, data: UpdateUserDto, request: Request) {

        const mainUserRole = request["user"].role;
        const checkRole = await this.roleRepo.findOne({ where: { name: mainUserRole } });
        if (!checkRole) throw new NotFoundException("Main user role not found!");

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");
        const userRole = user.role;

        if (mainUserRole === userRole) throw new BadRequestException("You do not have access!");
        if (mainUserRole === UserRole.Admin && userRole === UserRole.SuperAdmin) throw new BadRequestException("You do not have access!");

        await this.userRepo.update({ id: userId }, data);
        return;

    }

    async deleteUser (userId: number, request: Request) {

        const mainUserRole = request["user"].role;
        const checkRole = await this.roleRepo.findOne({ where: { name: mainUserRole } });
        if (!checkRole) throw new NotFoundException("Main user role not found!");

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");
        const userRole = user.role;

        if (mainUserRole === userRole) throw new BadRequestException("You do not have access!");
        if (mainUserRole === UserRole.Admin && userRole === UserRole.SuperAdmin) throw new BadRequestException("You do not have access!");

        await this.userRepo.remove(user);
        return;

    }


}
