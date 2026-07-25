import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddCategoryDto {

    @ApiProperty({ example: "orthodontics", description: "Enter the name field" })
    @IsNotEmpty({ message: "The name field can not be empty" })
    @IsString({ message: "The name field must be a string" })
    name!: string;

}