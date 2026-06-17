import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { Repository } from 'typeorm';
import { Permission } from '../entity/permission.entity';

@Injectable()
export class SeedService {

    constructor (

        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>

    ) {}

    async seedPermissionAndRole () {

        const roles = ["user", "superAdmin", "admin", "clerk", "orthodonticTherapist", "dentalHygienist", "dentalNurse", "dentalTechnician", "dentalTherapist", "dentist"];
        const permissions = ["user:read", "user:update", "user:delete", "user:create"];

        for (const role of roles) {

            const checkRole = await this.roleRepo.findOne({ where: { name: role } });
            if (!checkRole) {

                const newRole = this.roleRepo.create({ name: role });
                await this.roleRepo.save(newRole);

            }

        }

        for (const permission of permissions) {

            const checkPermission = await this.roleRepo.findOne({ where: { name: permission } });
            if (!checkPermission) {

                const newRole = this.permissionRepo.create({ name: permission });
                await this.permissionRepo.save(newRole);

            }

        }

        console.log("Seeding Role & Permission Are Done!");

    }


}
