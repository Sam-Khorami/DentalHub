import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";


export class OtpVerificationDto {

    @ApiProperty({ example: "sam", description: "Enter the username field" })
    @IsString({ message: "Username field must be a string" })
    @IsNotEmpty({ message: "Username field can not be empty" })
    @MinLength(3, { message: "Username field must be at least 3 chars" })
    username!: string;
    
    @ApiProperty({ example: "741364", description: "Enter the otp field" })
    @Length(6, 6, { message: "Otp must be 6 chars" })
    otp!: string;

}