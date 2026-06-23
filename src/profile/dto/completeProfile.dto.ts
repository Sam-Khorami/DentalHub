import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";


export class CompleteProfileDto {

    @ApiProperty({example: "sam", description: "Enter the firstName field"})
    @IsString({message: "The firstName field must be a string"})
    @IsNotEmpty({message: "The firstName field can not be empty"})
    firstName!: string;

    @ApiProperty({example: "khorrami", description: "Enter the lastName field"})
    @IsString({message: "The lastName field must be a string"})
    @IsNotEmpty({message: "The lastName field can not be empty"})
    lastName!: string;

    @ApiProperty({example: "2005-08-08", description: "Enter the birthDate field"})
    @IsDateString()
    @IsNotEmpty({message: "The birthDate field can not be empty"})
    birthDate!: Date;

}