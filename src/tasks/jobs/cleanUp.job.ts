import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Otp } from "../../entity/otp.entity";
import { Repository } from "typeorm";


@Injectable()
export class CleanUp {

    constructor (

        @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>

    ) {}


    async otpCleanup () {

        const otps = await this.otpRepo.find({ where: { isExpired: true } });
        if (!otps || typeof otps === "undefined") return console.log("Otp Table is clear");


        for (const otp of otps) {

            await this.otpRepo.remove(otp);

        }

        return console.log("The otp table is clear");

    }

}