import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";


export class UpdateUserDto {

    @ApiProperty({example: "sam", description: "Enter the username field"})
    @IsString({message: "Username field must be a string"})
    @IsOptional()
    username!: string;

    @ApiProperty({example: "samkhorrami84@gmail.com", description: "Enter the email field"})
    @IsEmail()
    @IsOptional()
    email!: string;
    
    @IsEnum(UserRole, {message: "The role field is invalid"})
    @IsOptional()
    role!: UserRole;

}