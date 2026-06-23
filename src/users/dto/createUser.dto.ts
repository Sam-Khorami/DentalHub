import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto {

    @ApiProperty({example: "sam", description: "Enter the username field"})
    @IsString({message: "Username field must be a string"})
    @IsNotEmpty({message: "Username field can not be empty"})
    username!: string;

    @ApiProperty({example: "samkhorrami84@gmail.com", description: "Enter the email field"})
    @IsNotEmpty({message: "Email field can not be empty"})
    @IsEmail()
    email!: string;

    @ApiProperty({example: "4061539558s", description: "Enter the password field"})
    @IsString({message: "password field must be a string"})
    @IsNotEmpty({message: "password field can not be empty"})
    password!: string;

    @IsEnum(UserRole, {message: "The role field is invalid"})
    @IsOptional()
    role!: UserRole;

}