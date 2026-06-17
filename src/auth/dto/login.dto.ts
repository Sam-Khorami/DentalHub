import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto {

    @ApiProperty({ example: "sam", description: "Enter the username field" })
    @IsString({ message: "Username field must be a string" })
    @IsNotEmpty({ message: "Username field can not be empty" })
    @MinLength(3, { message: "Username field must be at least 3 chars" })
    username!: string;

    @ApiProperty({ example: "4061539558s", description: "Enter the password field" })
    @IsString({ message: "Password field must be a string" })
    @IsNotEmpty({ message: "Password field can not be empty" })
    @MinLength(8, { message: "Password field must be at least 8 chars" })
    password!: string;

}