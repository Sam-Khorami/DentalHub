import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {

    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {

        this.transporter = nodemailer.createTransport({

            service: "gmail",
            auth: {

                user: this.configService.get("GMAIL_USER"),
                pass: this.configService.get("GMAIL_PASSWORD")

            }

        }) 

    }

    async sendOtp (to: string, otp: string) {

        this.transporter.sendMail({

            from: this.configService.get("GMAIL_USER"),
            to,
            subject: "OTP code",
            text: `Your Otp Code is ${otp} you have got only 2 minutes to use this code!`

        });

    }

    async sendEmailToAdmins (admins: string[], text: string) {

        admins.forEach((admin) => {

            this.transporter.sendMail({

                from: this.configService.get("GMAIL_USER"),
                to: admin,
                subject: "To Admins",
                text

            })

        })

    }

    async sendEmailToUser (user: string, text: string) {

        this.transporter.sendMail({

            from: this.configService.get("GMAIL_USER"),
            to: user,
            subject: "To User",
            text

        })


    }


}
