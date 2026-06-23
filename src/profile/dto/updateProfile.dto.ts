import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateProfileDto {

    @ApiProperty({example: "sam", description: "Enter the firstName field"})
    @IsString({message: "The firstName field must be a string"})
    @IsOptional()
    firstName!: string;

    @ApiProperty({example: "khorrami", description: "Enter the lastName field"})
    @IsString({message: "The lastName field must be a string"})
    @IsOptional()
    lastName!: string;

    @ApiProperty({example: "2005-08-08", description: "Enter the birthDate field"})
    @IsDateString()
    @IsOptional()
    birthDate!: Date;

}